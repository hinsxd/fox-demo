import { Field, Float, ID, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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
}
