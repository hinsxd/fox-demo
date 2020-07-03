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
  Field
} from 'type-graphql';
import {
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
  Connection,
  In,
  MoreThan
} from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User, UserRole } from 'src/entity/User';
import { MyContext } from 'src/types/Context';
import { SetNumberOfPeopleArgs } from './argsTypes';
import { UserRepository } from '../user/repository';
import { format, utcToZonedTime } from 'date-fns-tz';
import { isEqual, addWeeks, differenceInMinutes } from 'date-fns';
import { getCartItemPrice } from 'src/utils/getCartItemPrice';

@Resolver(CartItem)
export class CartItemResolver {
  @InjectRepository(CartItem)
  private readonly cartItemRepo: Repository<CartItem>;

  @InjectRepository(Teacher)
  private readonly teacherRepo: Repository<Teacher>;

  @InjectRepository(Lesson)
  private readonly lessonRepo: Repository<Lesson>;

  @InjectRepository(User)
  private readonly userRepo: UserRepository;

  @Mutation(type => CartItem, { nullable: true })
  async setNumberOfPeople(
    @Args() { lessonId, numberOfPeople }: SetNumberOfPeopleArgs,
    @Ctx() { userId }: MyContext
  ) {
    if (!userId) throw new Error('Unauthorized');
    if (numberOfPeople < 1 || numberOfPeople > 4)
      throw new Error('Invalid number');
    await this.cartItemRepo
      .createQueryBuilder('cartItem')
      .update()
      .set({ numberOfPeople })
      .where('lessonId = :lessonId', { lessonId })
      .andWhere('userId = :userId', { userId })
      .execute();
    return await this.cartItemRepo.findOneOrFail({ lessonId, userId });
  }

  @FieldResolver()
  async price(@Root() cartItem: CartItem) {
    return getCartItemPrice(cartItem);
  }
}
