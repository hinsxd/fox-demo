import { ArgsType, Field, ID, Int, Float, InputType } from 'type-graphql';
import { LessonStatus } from 'src/entity/Lesson';
@ArgsType()
export class AddToCartArgs {
  @Field(type => ID)
  id: string;
}
@ArgsType()
export class RemoveFromCartArgs {
  @Field(type => ID)
  id: string;
}

@ArgsType()
export class AddLessonArgs {
  @Field(type => ID)
  teacherId: string;

  @Field(type => Date)
  start: Date;

  @Field(type => Date)
  end: Date;

  @Field({ defaultValue: '' })
  comment: string;

  // @Field(type => Boolean)
  // bookable: boolean;

  @Field(type => LessonStatus, { defaultValue: LessonStatus.Hidden })
  status: LessonStatus;

  // @Field(type => Boolean)
  // visible: boolean;

  @Field(type => Int)
  repeatWeeks: number;
}

@ArgsType()
export class EditLessonArgs {
  @Field(type => ID)
  id: string;

  @Field(type => ID)
  teacherId: string;

  @Field(type => Date)
  start: Date;

  @Field(type => Date)
  end: Date;

  @Field()
  comment: string;

  @Field()
  cancelReason: string;

  @Field(type => LessonStatus)
  status: LessonStatus;
}

@ArgsType()
export class DeleteLessonArgs {
  @Field(type => ID)
  id: string;

  @Field(type => String, { nullable: true })
  cancelReason: string;
}

@ArgsType()
export class BookLessonsArgs {
  // @Field(type => [ID])
  // ids: string[];

  @Field(type => [String])
  cartItemIds: string[];

  @Field(type => Int)
  amount: number;

  @Field()
  source: string;

  @Field()
  ccLast4: string;
}

@ArgsType()
export class LessonsArgs {
  @Field(type => Date, { nullable: true })
  start: Date;
  @Field(type => Date, { nullable: true })
  end: Date;
}

@ArgsType()
export class SetCommentArgs {
  @Field(type => ID)
  id: string;

  @Field()
  comment: string;
}
@ArgsType()
export class SwapLessonArgs {
  @Field(type => ID)
  fromId: string;

  @Field(type => ID)
  toId: string;

  @Field()
  source: string;

  @Field()
  ccLast4: string;
}

@ArgsType()
export class SetLessonsStatusArgs {
  @Field(type => Date)
  from: Date;

  @Field(type => Date)
  to: Date;

  @Field(type => LessonStatus)
  status: LessonStatus;
}
