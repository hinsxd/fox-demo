import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from './Student';
import { Teacher } from './Teacher';

@ObjectType()
@Entity({
  orderBy: { start: 'ASC' },
})
export class Lesson {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'timestamp with time zone' })
  start: Date;

  @Field()
  @Column({ type: 'timestamp with time zone' })
  end: Date;

  @Field()
  @Column({ default: '' })
  comment: string;

  @Field((type) => Teacher)
  @ManyToOne(
    (type) => Teacher,
    (teacher) => teacher.lessons,
    { eager: true }
  )
  teacher: Teacher;

  @Column()
  teacherId: string;

  @Field((type) => Student, { nullable: true })
  @ManyToOne(
    (type) => Student,
    (student) => student.bookedLessons,
    {
      nullable: true,
      lazy: true,
    }
  )
  student?: Promise<Student>;

  @Column({ nullable: true })
  studentId?: string | null;
}
