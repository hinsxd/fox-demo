import * as bcrypt from 'bcrypt';
import { User } from 'src/entity/User';
import { MyContext } from 'src/types/Context';
import {
  Args,
  ArgsType,
  Ctx,
  Field,
  ID,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

@ArgsType()
export class LoginArgs {
  @Field()
  username: string;
  @Field()
  password: string;
}
@ArgsType()
export class CheckUsernameUsedArgs {
  @Field()
  username: string;
}

@ArgsType()
export class UserArgs {
  @Field(() => ID)
  id: string;
}

// import * as bcrypt from 'bcrypt';

@Resolver(User)
export class UserResolver {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

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

      const user = await this.userRepo.findOneOrFail(userId);

      return user;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  @Mutation(() => User)
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

  @Query(() => User)
  async user(@Args() { id }: UserArgs): Promise<User> {
    return this.userRepo.findOneOrFail(id);
  }

  @Query(() => [User])
  async users() {
    return this.userRepo.find();
  }
}
