import { IsNotEmpty, Length } from 'class-validator';
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  Admin,
  User,
  NewUser,
}

registerEnumType(UserRole, {
  name: 'UserRole', // this one is mandatory
  description: 'User Roles', // this one is optional
});

@Entity()
@ObjectType()
export class User {
  // @OneToOne((type) => UserProfile, {
  //   nullable: true,
  //   eager: true,
  //   cascade: true,
  // })
  // @Field((type) => UserProfile, { nullable: true })
  // @JoinColumn()
  // profile?: UserProfile;

  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field((type) => UserRole)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NewUser,
  })
  @IsNotEmpty()
  role: UserRole;

  @Length(6, 20)
  @Column({ unique: true, nullable: true })
  @Field({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  password?: string;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  // @Field(type => CartInfo)
  // cartInfo: CartInfo;
}
