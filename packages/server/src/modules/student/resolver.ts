import { Lesson } from 'src/entity/Lesson';
import { Student } from 'src/entity/Student';
import {
  Args,
  ArgsType,
  Field,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

// import * as bcrypt from 'bcrypt';
@ArgsType()
class StudentArgs {
  @Field((type) => ID)
  id: string;
}
@ArgsType()
class AddStudentArgsType {
  @Field()
  name: string;

  @Field({ defaultValue: '' })
  phone: string;

  @Field({ defaultValue: '' })
  emergencyName: string;

  @Field({ defaultValue: '' })
  emergencyRelation: string;

  @Field({ defaultValue: '' })
  emergencyPhone: string;

  @Field({ defaultValue: '' })
  detailedAddress: string;
}
@ArgsType()
class EditStudentArgsType {
  @Field((type) => ID)
  id: string;
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  emergencyName?: string;

  @Field({ nullable: true })
  emergencyRelation?: string;

  @Field({ nullable: true })
  emergencyPhone?: string;

  @Field({ nullable: true })
  detailedAddress?: string;
}

@Resolver(Student)
export class StudentResolver {
  @InjectRepository(Student)
  private readonly studentRepo: Repository<Student>;

  @InjectRepository(Lesson)
  private readonly lessonRepo: Repository<Lesson>;

  @Query((type) => [Student])
  async students() {
    return this.studentRepo.find();
  }

  @Query((type) => Student)
  async student(@Args() { id }: StudentArgs) {
    return this.studentRepo.findOneOrFail(id);
  }

  @Mutation((type) => Student)
  async addStudent(@Args() args: AddStudentArgsType) {
    return this.studentRepo.save(args);
  }

  @Mutation((type) => Student)
  async editStudent(@Args() { id, ...updates }: EditStudentArgsType) {
    const student = await this.studentRepo.findOneOrFail(id);
    return this.studentRepo.save({ ...student, ...updates });
  }
  @FieldResolver((type) => [Lesson])
  async bookedLessons(@Root() { bookedLessons }: Student) {
    return await bookedLessons;
  }
}
