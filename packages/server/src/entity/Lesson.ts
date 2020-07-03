import { User } from './User';
import { Teacher } from './Teacher';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  AfterUpdate,
  AfterLoad,
  BeforeUpdate,
  getRepository,
  AfterInsert,
  BeforeInsert,
} from 'typeorm';
import { ObjectType, Field, ID, Float, registerEnumType } from 'type-graphql';
import { differenceInMinutes, isBefore } from 'date-fns';
import { IsNotEmpty } from 'class-validator';

export enum LessonStatus {
  Hidden,
  DisplayOnly,
  Bookable,
  Booked,
  Cancelled,
}

registerEnumType(LessonStatus, {
  name: 'LessonStatus', // this one is mandatory
  description: 'Lesson Status', // this one is optional
});
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

  @Column('int', { nullable: true })
  @Field((type) => Float, { nullable: true })
  numberOfPeople?: number;

  @Column('float', { nullable: true, default: null })
  @Field((type) => Float, { nullable: true })
  price?: number;

  @Field((type) => User, { nullable: true })
  @ManyToOne(
    (type) => User,
    (user) => user.bookedLessons,
    {
      nullable: true,
      lazy: true,
    }
  )
  student?: Promise<User>;

  @Column({ nullable: true })
  studentId?: string;

  @Field((type) => LessonStatus)
  @Column({
    type: 'enum',
    enum: LessonStatus,
    default: LessonStatus.Hidden,
  })
  @IsNotEmpty()
  status: LessonStatus;

  @Field()
  @Column({ default: '' })
  cancelReason: string;

  // To be removed
  @Field()
  @Column({ default: false })
  bookable: boolean;

  @Field()
  @Column({ default: false })
  visible: boolean;

  @Field()
  @Column({ default: false })
  cancelled: boolean;
  @Field()
  @Column({ default: false })
  booked: boolean;
  @Field()
  @Column({ default: false })
  locked: boolean;
  // To be removed

  @Field()
  inCart: boolean;
}
