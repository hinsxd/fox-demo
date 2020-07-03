import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ArgsType, Field, Int, ObjectType, ID } from 'type-graphql';

@ArgsType()
export class BookedLessonsArgs {
  @Field({ nullable: true })
  type?: 'upcoming' | 'past';

  @Field((type) => Int, { nullable: true })
  count?: number;
}

@ArgsType()
export class UpdateProfileArgs {
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  email?: string;
  @Field({ nullable: true })
  phone?: string;
  @Field({ nullable: true })
  emergencyName?: string;

  @Field({ nullable: true })
  emergencyRelation?: string;

  @Field({ nullable: true })
  emergencyPhone?: string;
  @Field({ nullable: true })
  region?: string;

  @Field({ nullable: true })
  district?: string;

  @Field({ nullable: true })
  street?: string;

  @Field({ nullable: true })
  detailedAddress?: string;
}

@ArgsType()
export class CompleteProfileArgs {
  @Field()
  @Length(6, 14)
  username: string;

  @Field()
  @Length(8, 20)
  password: string;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  phone: string;

  @Field()
  @IsNotEmpty()
  emergencyName: string;

  @Field()
  @IsNotEmpty()
  emergencyRelation: string;

  @Field()
  @IsNotEmpty()
  emergencyPhone: string;

  // @Field()
  // @IsNotEmpty()
  // region: string;

  // @Field()
  // @IsNotEmpty()
  // district: string;

  // @Field()
  // @IsNotEmpty()
  // street: string;

  @Field({ nullable: true })
  detailedAddress?: string;
}

// @ObjectType()
// export class District {
//   @Field()
//   district: number;
//   @Field()
//   name: string;

//   @Field(type => [Street])
//   streets: Street[];
// }
// @ObjectType()
// export class Street {
//   @Field()
//   street: string;
//   @Field()
//   name: string;
// }

// @ArgsType()
// export class GetDistrictsArgs {
//   @Field(type => Int)
//   regionId: number;
// }
// @ArgsType()
// export class GetStreetsArgs {
//   @Field(type => Int, { nullable: true })
//   regionId?: number;

//   @Field(type => Int, { nullable: true })
//   districtId?: number;
// }

@ArgsType()
export class LoginArgs {
  @Field()
  username: string;
  @Field()
  password: string;
}
@ArgsType()
export class CheckUsernameUsedArgs {
  @Field()
  username: string;
}

@ArgsType()
export class UserArgs {
  @Field((type) => ID)
  id: string;
}
