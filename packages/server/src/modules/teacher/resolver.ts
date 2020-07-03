import { isAuthenticated } from '../shared/middleware/isAuthenticated';
import {
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
  Int,
  Args,
  ArgsType,
  Field,
  ID
} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../../entity/User';
import { MyContext } from 'src/types/Context';
import { Lesson } from './../../entity/Lesson';
import { Teacher } from './../../entity/Teacher';

@ArgsType()
class AddTeacherArgs {
  @Field()
  name: string;

  @Field(type => Int)
  hourPrice: number;
}

@ArgsType()
class DeleteTeacherArgs {
  @Field(type => ID)
  id: string;
}

@ArgsType()
class UpdateTeacherArgs {
  @Field(type => ID)
  id: string;

  @Field()
  name: string;

  @Field(type => Int)
  hourPrice: number;

  @Field()
  color: string;
}
@Resolver(Teacher)
export class TeacherResolver {
  @InjectRepository(Teacher)
  private readonly teacherRepo: Repository<Teacher>;

  // @InjectRepository(Lesson)
  // private readonly lessonRepo: Repository<Lesson>;

  @Mutation(() => Teacher)
  async addTeacher(@Args() { name, hourPrice }: AddTeacherArgs) {
    if (name === '') {
      throw new Error('Name cannot be empty');
    }
    if (hourPrice < 0) {
      throw new Error('Hour Price cannot be negative');
    }
    return this.teacherRepo.save({ name, hourPrice });
  }

  @Mutation(() => Boolean)
  async deleteTeacher(@Args() { id }: DeleteTeacherArgs): Promise<boolean> {
    try {
      const result = await this.teacherRepo.delete({ id });
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Mutation(() => Teacher)
  async updateTeacher(@Args()
  {
    id,
    ...updates
  }: UpdateTeacherArgs): Promise<Teacher> {
    try {
      const teacher = await this.teacherRepo.findOneOrFail({ id });
      return this.teacherRepo.save({ ...teacher, ...updates });
    } catch (e) {
      throw new Error(e);
    }
  }

  @Query(() => [Teacher])
  async teachers() {
    return this.teacherRepo.find();
  }
}
