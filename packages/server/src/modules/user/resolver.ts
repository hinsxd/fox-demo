import { isFuture, isPast, compareAsc } from 'date-fns';
import { Lesson, LessonStatus } from 'src/entity/Lesson';
import { User, UserRole } from 'src/entity/User';
import { UserProfile } from 'src/entity/UserProfile';
import { MyContext } from 'src/types/Context';
import * as bcrypt from 'bcrypt';
import {
  Args,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Repository, In } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import {
  BookedLessonsArgs,
  CheckUsernameUsedArgs,
  CompleteProfileArgs,
  LoginArgs,
  UpdateProfileArgs,
  UserArgs,
} from './argTypes';
import { UserRepository } from './repository';
import { CartItem } from 'src/entity/CartItem';

// import * as bcrypt from 'bcrypt';

@Resolver(User)
export class UserResolver {
  @InjectRepository(User)
  private readonly userRepo: UserRepository;
  @InjectRepository(Lesson)
  private readonly lessonRepo: Repository<Lesson>;
  @InjectRepository(UserProfile)
  private readonly userProfileRepo: Repository<UserProfile>;

  @InjectRepository(CartItem)
  private readonly cartItemRepo: Repository<CartItem>;

  // @Query(() => [District])
  // getDistricts(@Args() { regionId }: GetDistrictsArgs): District[] {
  //   const region = regions.find(region => region.region === regionId);
  //   if (region) {
  //     return region.districts;
  //   }
  //   throw new Error('Zone not found');
  // }

  // @Query(() => [Street])
  // getStreets(@Args() { regionId, districtId }: GetStreetsArgs): Street[] {
  //   if (!regionId || !districtId) {
  //     return [];
  //   }
  //   const region = regions.find(region => region.region === regionId);
  //   if (region) {
  //     const district = region.districts.find(
  //       district => district.district === districtId
  //     );
  //     if (district) {
  //       return district.streets;
  //     }
  //     throw new Error('District not found');
  //   }
  //   throw new Error('Region not found');
  // }

  @Mutation(() => Boolean)
  // @Authorized()
  async logout(@Ctx() ctx: MyContext): Promise<boolean> {
    return new Promise((res) => {
      if (ctx.req.session) {
        ctx.req.session.destroy((err) => {
          if (err) {
            console.log('logout error: ', err);
          }

          res(true);
        });
      } else {
        res(true);
      }
    });
  }

  @Query(() => User, { nullable: true })
  // @Authorized()
  async me(@Ctx() { userId }: MyContext): Promise<User | null> {
    try {
      if (!userId) return null;

      const user = await this.userRepo.getUser(userId);

      const nonBookableIds = user.cartItems
        .filter(({ lesson: { status } }) => status !== LessonStatus.Bookable)
        .map(({ lesson }) => lesson.id);
      if (nonBookableIds.length > 0) {
        await this.cartItemRepo.delete({
          userId,
          lessonId: In(nonBookableIds),
        });
        return this.userRepo.getUser(userId);
      }
      return user;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  @Mutation(() => User)
  async completeProfile(
    @Ctx() { userId }: MyContext,
    @Args() args: CompleteProfileArgs
  ): Promise<User | null> {
    const { username, password, ...profile } = args;

    const user = await this.userRepo.getUser(userId);

    if (user.role !== UserRole.NewUser) {
      throw new Error('Non new user');
    }

    return this.userRepo.save({
      ...user,
      username,
      password: bcrypt.hashSync(args.password, 5),
      role: UserRole.User,
      profile,
    });
  }

  @Mutation((type) => User)
  async login(
    @Ctx() { req }: MyContext,
    @Args() { username, password }: LoginArgs
  ): Promise<User> {
    if (!username || !password) {
      throw new Error('empty fields');
    }
    try {
      // const hashedPassword = await bcrypt.hash(password, 5);
      const user = await this.userRepo.findOneOrFail({ username });
      if (!user.password) {
        throw new Error('Invalid User');
      }
      if (
        !bcrypt.compareSync(password, user.password) &&
        user.password !== password
      ) {
        throw new Error('Invalid username / password combination');
      }
      if (req.session) {
        req.session.userId = user.id;
      }
      return user;
    } catch (e) {
      throw e;
    }
  }

  @Mutation((type) => User)
  async updateProfile(
    @Args()
    updateArgs: UpdateProfileArgs,
    @Ctx() { userId }: MyContext
  ) {
    const user = await this.userRepo.getUser(userId);
    return this.userRepo.save({
      ...user,
      profile: {
        ...user.profile,
        ...updateArgs,
      },
    });
  }

  @Query((type) => User)
  async user(
    @Args() { id }: UserArgs,
    @Ctx() { userId }: MyContext
  ): Promise<User> {
    const user = await this.userRepo.getUser(userId);
    if (user.role !== UserRole.Admin) throw new Error('Not authorized');
    return this.userRepo.getUser(id);
  }

  @Query((type) => [User])
  async users(@Ctx() { userId }: MyContext) {
    const user = await this.userRepo.getUser(userId);
    if (user.role !== UserRole.Admin) throw new Error('Not authorized');

    return this.userRepo.find();
  }
  @Query((type) => Boolean)
  async checkUsernameUsed(@Args() { username }: CheckUsernameUsedArgs) {
    const user = await this.userRepo.findOne({ where: { username } });
    return !!user;
  }

  @FieldResolver((type) => [Lesson])
  async bookedLessons(
    @Root() { bookedLessons }: User,
    @Args() { type, count }: BookedLessonsArgs
  ) {
    const lessons = await bookedLessons;
    if (!type) {
      return lessons.slice(0, count);
    }
    const filterFn = type === 'past' ? isPast : isFuture;
    return lessons
      .sort((a, b) => compareAsc(a.start, b.start))
      .filter((lesson) => filterFn(lesson.start))
      .slice(0, count);
  }

  @FieldResolver((type) => [Lesson])
  async cancelledLessons(
    @Root() { id }: User,
    @Args() { type, count }: BookedLessonsArgs
  ) {
    return this.lessonRepo.find({
      where: {
        studentId: id,
        status: LessonStatus.Cancelled,
      },
    });
  }
}
