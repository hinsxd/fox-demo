import gql from 'graphql-tag';
// import { lessonFragment } from '../fragment/lessonFragment';

export const ADD_LESSON_MUTATION = gql`
  mutation AddLesson(
    $teacherId: ID!
    $start: DateTime!
    $end: DateTime!
    $repeatWeeks: Int!
    $status: LessonStatus!
  ) {
    addLesson(
      teacherId: $teacherId
      start: $start
      end: $end
      repeatWeeks: $repeatWeeks
      status: $status
    )
  }
`;
