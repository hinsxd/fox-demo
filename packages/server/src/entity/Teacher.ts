import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import { ObjectType, Field, ID, Int, Float } from 'type-graphql';
import { Lesson } from './Lesson';

@Entity()
@ObjectType()
export class Teacher {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field((type) => [Lesson], { nullable: true })
  @OneToMany(
    (type) => Lesson,
    (lesson) => lesson.teacher,
    {
      cascade: ['insert', 'update', 'remove'],
      lazy: true,
    }
  )
  lessons: Promise<Lesson[]>;

  @Field((type) => Float)
  @Column({ type: 'decimal', precision: 10, scale: 0 })
  hourPrice: number;

  @Field()
  @Column({ default: '#004DCF' })
  color: string;
}
