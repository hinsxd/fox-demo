import { Lesson } from 'src/entity/Lesson';
import { User } from 'src/entity/User';
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
  JoinTable,
  PrimaryColumn,
  JoinColumn
} from 'typeorm';
import {
  ObjectType,
  Field,
  ID,
  Float,
  registerEnumType,
  Int
} from 'type-graphql';
@Entity()
@ObjectType()
export class CartItem {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => Lesson, { eager: true })
  @Field(type => Lesson)
  @JoinColumn()
  lesson: Lesson;

  @ManyToOne(type => User)
  @Field(type => User)
  @JoinColumn()
  user: User;

  @PrimaryColumn()
  userId: string;
  @PrimaryColumn()
  lessonId: string;

  @Column('int')
  @Field(type => Int)
  numberOfPeople: number;

  @Field(type => Float)
  price: number;
}
