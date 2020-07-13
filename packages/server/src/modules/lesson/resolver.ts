import { addWeeks } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { Lesson } from 'src/entity/Lesson';
import { Teacher } from 'src/entity/Teacher';
import { User } from 'src/entity/User';
import {
  Args,
  Authorized,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import {
  AddLessonArgs,
  DeleteLessonArgs,
  EditLessonArgs,
  SetCommentArgs,
} from './argsTypes';

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
  @InjectRepository(Teacher)
  private readonly teacherRepo: Repository<Teacher>;

  @InjectRepository(Lesson)
  private readonly lessonRepo: Repository<Lesson>;

  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  @Query((type) => [Lesson])
  async lessons() {
    return this.lessonRepo.find();
  }

  @Mutation((type) => Boolean)
  async addLesson(
    @Args() { teacherId, ...details }: AddLessonArgs
  ): Promise<boolean> {
    try {
      const { repeatWeeks, start, end, comment } = details;
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
    try {
      const lesson = await this.lessonRepo.findOneOrFail({ id });

      return this.lessonRepo.save({ ...lesson, ...updates });
    } catch (err) {
      throw new Error(err);
    }
  }

  @Mutation((type) => Lesson)
  @Authorized()
  async setComment(@Args() { id, comment }: SetCommentArgs) {
    const lesson = await this.lessonRepo.findOneOrFail({ id });

    await this.lessonRepo.save({ ...lesson, comment });
    return this.lessonRepo.findOneOrFail({ id });
  }

  @Mutation((type) => String)
  async deleteLesson(@Args() { id }: DeleteLessonArgs) {
    return this.lessonRepo.delete(id);
  }

  @FieldResolver((type) => User)
  async student(@Root() { student }: Lesson) {
    return await student;
  }
}
