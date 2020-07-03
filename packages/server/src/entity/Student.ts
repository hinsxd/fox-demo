import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Lesson } from './Lesson';

@Entity()
@ObjectType()
export class Student {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column('text')
  phone: string;

  @Field()
  @Column('text')
  emergencyName: string;

  @Field()
  @Column('text', { default: '' })
  emergencyRelation: string;

  @Field()
  @Column('text')
  emergencyPhone: string;

  @Field()
  @Column('text', { default: '' })
  detailedAddress: string;

  @Field((type) => [Lesson])
  @OneToMany(
    (type) => Lesson,
    (lesson) => lesson.student,
    {
      cascade: ['insert'],
      lazy: true,
    }
  )
  bookedLessons: Promise<Lesson[]>;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  // @Field(type => CartInfo)
  // cartInfo: CartInfo;
}
