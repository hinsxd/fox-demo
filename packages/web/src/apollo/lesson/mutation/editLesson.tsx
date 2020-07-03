import gql from 'graphql-tag';
import { lessonFragment } from '../fragment/lessonFragment';

export const EDIT_LESSON_MUTATION = gql`
  mutation EditLesson(
    $id: ID!
    $teacherId: ID!
    $start: DateTime!
    $end: DateTime!
    $comment: String!
    $cancelReason: String!
    $status: LessonStatus!
  ) {
    editLesson(
      id: $id
      teacherId: $teacherId
      start: $start
      end: $end
      comment: $comment
      cancelReason: $cancelReason
      status: $status
    ) {
      ...lessonFragment
    }
  }
  ${lessonFragment}
`;
