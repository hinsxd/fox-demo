import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import {
  ObjectType,
  Field,
  ID,
  Int,
  Float,
  registerEnumType
} from 'type-graphql';
import { Length, IsNotEmpty } from 'class-validator';
import { UserProfile } from './UserProfile';
import { CartItem } from './CartItem';
import { Lesson } from './Lesson';

export enum UserRole {
  Admin,
  User,
  NewUser
}

registerEnumType(UserRole, {
  name: 'UserRole', // this one is mandatory
  description: 'User Roles' // this one is optional
});

@Entity()
@ObjectType()
export class User {
  @OneToOne(type => UserProfile, { nullable: true, eager: true, cascade: true })
  @Field(type => UserProfile, { nullable: true })
  @JoinColumn()
  profile?: UserProfile;

  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field(type => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NewUser
  })
  @IsNotEmpty()
  role: UserRole;

  @Length(6, 20)
  @Column({ unique: true, nullable: true })
  @Field({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  password?: string;

  // @Field({ nullable: true })
  @Column({ unique: true, nullable: true })
  stripeId?: string;

  // @Field({ nullable: true })
  @Column({ unique: true, nullable: true })
  fbProviderId?: string;

  // @Field({ nullable: true })
  @Column({ unique: true, nullable: true })
  googleProviderId?: string;

  @Field(type => [Lesson])
  @OneToMany(
    type => Lesson,
    lesson => lesson.student,
    {
      cascade: ['insert'],
      lazy: true
    }
  )
  bookedLessons: Promise<Lesson[]>;

  @Field(type => [Lesson])
  cancelledLessons: Promise<Lesson[]>;

  @Field(type => [Lesson])
  @ManyToMany(type => Lesson, { eager: true })
  @JoinTable()
  cart: Lesson[];

  @Field(type => [CartItem])
  @OneToMany(
    type => CartItem,
    cartItem => cartItem.user,
    { eager: true }
  )
  cartItems: CartItem[];

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  // @Field(type => CartInfo)
  // cartInfo: CartInfo;
}
