import { groupBy } from 'lodash';
import { Lesson, LessonStatus } from 'src/entity/Lesson';
import { CartItem } from 'src/entity/CartItem';
import { Teacher } from 'src/entity/Teacher';
import {
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  Int,
  Args,
  Authorized,
  ObjectType,
  Field,
} from 'type-graphql';
import {
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
  Connection,
  In,
  MoreThan,
  Any,
  Not,
} from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User, UserRole } from 'src/entity/User';
import { MyContext } from 'src/types/Context';
import {
  LessonsArgs,
  AddToCartArgs,
  AddLessonArgs,
  BookLessonsArgs,
  DeleteLessonArgs,
  RemoveFromCartArgs,
  SwapLessonArgs,
  EditLessonArgs,
  SetCommentArgs,
  SetLessonsStatusArgs,
} from './argsTypes';
import { UserRepository } from '../user/repository';
import { format, utcToZonedTime } from 'date-fns-tz';
import { isEqual, addWeeks, isPast, isFuture } from 'date-fns';
import { getCartItemPrice } from 'src/utils/getCartItemPrice';

import * as nodemailer from 'nodemailer';

const timeZone = 'Asia/Hong_Kong';
const formatToHK = (time: Date, fmt: string) =>
  format(utcToZonedTime(time, timeZone), fmt, { timeZone });

const formatToDescriptionDateTime = (lesson: Lesson) => {
  return `${formatToHK(lesson.start, 'dd MMM')} ${formatToHK(
    lesson.start,
    'HH:mm'
  )}-${formatToHK(lesson.end, 'HH:mm')}`;
};
@Resolver(Lesson)
export class LessonResolver {
  @InjectRepository(CartItem)
  private readonly cartItemRepo: Repository<CartItem>;

  @InjectRepository(Teacher)
  private readonly teacherRepo: Repository<Teacher>;

  @InjectRepository(Lesson)
  private readonly lessonRepo: Repository<Lesson>;

  @InjectRepository(User)
  private readonly userRepo: UserRepository;

  @Query((type) => [Lesson])
  async lessons(
    @Ctx() { userId }: MyContext,
    @Args() { start, end }: LessonsArgs
  ) {
    try {
      const user = await this.userRepo.getUser(userId);
      if (user.role === UserRole.Admin) {
        return this.lessonRepo.find();
      }
      const result = await this.lessonRepo.find({
        where: {
          start: MoreThanOrEqual(start),
          end: LessThanOrEqual(end),
          status: LessonStatus.Bookable,
        },
      });

      return result.filter(({ start }) => isFuture(start));
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  @Mutation((type) => Boolean)
  async addLesson(
    @Args() { teacherId, ...details }: AddLessonArgs
  ): Promise<boolean> {
    try {
      const { repeatWeeks, start, end, comment, status } = details;
      await this.lessonRepo
        .createQueryBuilder()
        .insert()
        .values(
          Array(repeatWeeks)
            .fill(0)
            .map((z, i) => ({
              teacherId,
              start: addWeeks(start, i),
              end: addWeeks(end, i),
              status,
              comment,
            }))
        )
        .execute();
      return true;
    } catch (err) {
      throw new Error(err);
    }
  }
  @Mutation((type) => Lesson)
  async editLesson(@Args() { id, ...updates }: EditLessonArgs) {
    let teacher: Teacher | undefined;
    try {
      teacher = await this.teacherRepo.findOneOrFail(updates.teacherId);
    } catch {
      throw new Error('Teacher not found.');
    }
    try {
      const lesson = await this.lessonRepo.findOneOrFail({ id });
      if (
        (lesson.status === LessonStatus.Booked ||
          lesson.status === LessonStatus.Cancelled) &&
        (!isEqual(updates.start, lesson.start) ||
          !isEqual(updates.end, lesson.end))
      ) {
        throw new Error('Cannot reschedule booked lesson');
      }

      return this.lessonRepo.save({ ...lesson, ...updates });
    } catch (err) {
      throw new Error(err);
    }
  }

  @Mutation((type) => Boolean)
  @Authorized()
  async addToCart(
    @Args() { id }: AddToCartArgs,
    @Ctx() { userId }: MyContext
  ): Promise<boolean> {
    if (!userId) throw new Error('Unauthorized');
    try {
      await this.cartItemRepo
        .createQueryBuilder()
        .insert()
        .values({ userId, lessonId: id, numberOfPeople: 1 })
        .execute();
      return true;
    } catch {
      console.error('Item exist');
      return false;
    }
  }

  @Mutation((type) => Boolean)
  @Authorized()
  async removeFromCart(
    @Args() { id }: RemoveFromCartArgs,
    @Ctx() { userId }: MyContext
  ): Promise<boolean> {
    if (!userId) throw new Error('Unauthorized');
    try {
      await this.cartItemRepo.delete({ userId, lessonId: id });
      return true;
    } catch {
      console.error('Item not exist');
      return false;
    }
  }

  @Mutation((type) => [Lesson])
  @Authorized()
  async bookLessons(
    @Args() { cartItemIds: ids, amount, source, ccLast4 }: BookLessonsArgs,
    @Ctx() { req, stripe, userId }: MyContext
  ): Promise<Lesson[]> {
    try {
      // const ids = lessonMetas.map(({ id }) => id);
      const user = await this.userRepo.getUser(userId);
      const selectedCartItems = user.cartItems.filter(
        (cartItem) => ids.includes(cartItem.id) && !cartItem.lesson.booked
      );

      if (selectedCartItems.length !== ids.length) {
        throw new Error(
          'Invalid data. Possibly some items have been booked. Please refresh browesr.'
        );
      }

      const lessons = selectedCartItems.map(
        ({ lesson, price, numberOfPeople }) => ({
          ...lesson,
          price,
          numberOfPeople,
          comment: '',
          studentId: user.id,
          status: LessonStatus.Booked,
        })
      );

      const total = selectedCartItems.reduce((sum, cartItem) => {
        sum += getCartItemPrice(cartItem);
        return sum;
      }, 0);

      if (total != amount) {
        throw new Error('Invalid submitted data.');
      }
      const userName = user.profile ? user.profile.name : user.username;
      const description =
        userName +
        ' Lesson(s) on ' +
        lessons
          .map(
            (lesson) =>
              ` ${formatToDescriptionDateTime(lesson)}` +
              (lesson.numberOfPeople > 1
                ? ` (${lesson.numberOfPeople} students)`
                : '')
          )
          .join(',')
          .trim();
      await stripe.charges.create({
        amount,
        currency: 'hkd',
        description,
        source,
        receipt_email: user.profile ? user.profile.email : user.email,
      });
      await this.lessonRepo.save(lessons);
      await this.cartItemRepo.delete({
        userId: user.id,
        lessonId: In(ids),
      });
      return this.lessonRepo.findByIds(lessons.map(({ id }) => id));
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }

  @Mutation((type) => Lesson)
  @Authorized()
  async setComment(
    @Args() { id, comment }: SetCommentArgs,
    @Ctx() { userId }: MyContext
  ) {
    const lesson = await this.lessonRepo.findOneOrFail({ id });
    if (
      !(
        lesson.status === LessonStatus.Booked ||
        lesson.status === LessonStatus.Cancelled
      ) ||
      !lesson.studentId ||
      !userId ||
      lesson.studentId !== userId
    ) {
      throw new Error('Invalid situation');
    }
    await this.lessonRepo.save({ ...lesson, comment });
    return this.lessonRepo.findOneOrFail({ id });
  }

  @Mutation((type) => Lesson)
  @Authorized()
  async swapLesson(
    @Args() { fromId, toId, source, ccLast4 }: SwapLessonArgs,
    @Ctx() { userId, stripe }: MyContext
  ) {
    if (fromId === toId) throw new Error('Cannot swap to same lesson');
    try {
      const user = await this.userRepo.getUser(userId);
      const userName = user.profile ? user.profile.name : user.username;
      const fromLesson = await this.lessonRepo.findOneOrFail({
        id: fromId,
        studentId: user.id,
        // status: LessonStatus.Booked
      });
      const toLesson = await this.lessonRepo.findOneOrFail({
        id: toId,
        status: LessonStatus.Bookable,
      });
      await this.lessonRepo
        .createQueryBuilder()
        .update()
        .set({
          student: undefined,
          status: LessonStatus.Bookable,
        })
        .where('id = :id', { id: fromId })
        .execute();
      await this.lessonRepo
        .createQueryBuilder()
        .update()
        .set({ studentId: user.id, status: LessonStatus.Booked })
        .where('id = :id', { id: toId })
        .execute();
      const charge = await stripe.charges.create({
        amount: 5000,
        currency: 'hkd',
        description: `${userName} Swap lesson from ${formatToDescriptionDateTime(
          fromLesson
        )} to ${formatToDescriptionDateTime(toLesson)}`,
        source,
      });
      return await this.lessonRepo.findOneOrFail(fromId);
    } catch (e) {
      throw new Error(e);
    }
  }

  @Mutation((type) => String)
  async deleteLesson(@Args() { id, cancelReason }: DeleteLessonArgs) {
    try {
      const lesson = await this.lessonRepo.findOneOrFail({
        where: { id },
      });
      if (lesson.status === LessonStatus.Cancelled) {
        throw new Error('Already cancelled');
      }
      if (lesson.status === LessonStatus.Booked && !!lesson.studentId) {
        const user = await this.userRepo.findOneOrFail(lesson.studentId);
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'mrfoxltd@gmail.com',
            pass: 'pojkfdunrvofupkr',
          },
        });
        const mailOptions = {
          from: 'Mr Fox Limited <mrfoxltd@gmail.com>', // sender address
          to: user.email, // list of receivers
          subject: `[Dr Maths] Lesson Cancelled: ${formatToDescriptionDateTime(
            lesson
          )}`, // Subject line
          html: `<p>Your lesson on ${formatToDescriptionDateTime(
            lesson
          )} has been cancelled. </p>
          <p><b>Reason: </b>${cancelReason}</p>
          <p>We will contact you as soon as possible about refunding. Thank you</p>`, // plain text body
        };
        transporter.sendMail(mailOptions, async (err, info) => {
          if (err) {
            // Sending mail failed. aborting
            console.error(err);
          } else {
            // sending mail success.
            // saving lesson
            lesson.cancelReason = cancelReason || '';
            lesson.status = LessonStatus.Cancelled;
            await this.lessonRepo.save(lesson);
          }
        });
      } else {
        await this.lessonRepo.delete(id);
      }
      return id;
    } catch (e) {
      console.error(e);
      throw new Error('Lesson not found');
    }
  }

  @Mutation((type) => [Lesson])
  async setLessonsStatus(
    @Args() { from, to, status }: SetLessonsStatusArgs
  ): Promise<Lesson[]> {
    const lessons = await this.lessonRepo.find({
      start: MoreThanOrEqual(from),
      end: LessThanOrEqual(to),
      status: Not(In([LessonStatus.Booked, LessonStatus.Cancelled])),
    });
    return this.lessonRepo.save(
      lessons.map((lesson) => ({ ...lesson, status }))
    );
  }

  @FieldResolver((type) => User)
  async student(@Root() lesson: Lesson) {
    return this.userRepo.findOne({ id: lesson.studentId });
  }

  @FieldResolver((type) => Teacher)
  async teacher(@Root() lesson: Lesson) {
    return this.teacherRepo.findOneOrFail(lesson.teacherId);
  }

  @FieldResolver((type) => Boolean)
  @Authorized()
  async inCart(@Root() lesson: Lesson, @Ctx() { userId }: MyContext) {
    if (!userId) return false;
    const cartItem = await this.cartItemRepo.findOne({
      userId,
      lessonId: lesson.id,
    });
    return !!cartItem;
  }
}
