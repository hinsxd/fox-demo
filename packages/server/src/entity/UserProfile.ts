import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

// @ObjectType()
// export class CartInfo {
//   @Field(type => [Lesson])
//   lessons: Lesson[];

//   @Field(type => Int)
//   count: number;

//   @Field(type => Float)
//   total: number;
// }

@Entity()
@ObjectType()
export class UserProfile {
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
  email: string;

  @Field()
  @Column('text')
  emergencyName: string;

  @Field()
  @Column('text', { default: '' })
  emergencyRelation: string;

  @Field()
  @Column('text')
  emergencyPhone: string;

  // @Field()
  // @Column('text')
  // region: string;

  // @Field()
  // @Column('text')
  // district: string;

  // @Field()
  // @Column('text')
  // street: string;

  @Field()
  @Column('text', { default: '' })
  detailedAddress: string;
}
