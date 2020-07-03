import { ArgsType, Field, ID, Int } from 'type-graphql';

@ArgsType()
export class SetNumberOfPeopleArgs {
  @Field(type => ID)
  lessonId: string;

  @Field(type => Int)
  numberOfPeople: number;
}
