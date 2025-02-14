import gql from 'graphql-tag';
import { lessonFragment } from '../fragment/lessonFragment';

export const EDIT_LESSON_MUTATION = gql`
  mutation EditLesson(
    $id: ID!
    $studentId: ID
    $teacherId: ID!
    $start: DateTime!
    $end: DateTime!
    $comment: String!
  ) {
    editLesson(
      id: $id
      studentId: $studentId
      teacherId: $teacherId
      start: $start
      end: $end
      comment: $comment
    ) {
      ...lessonFragment
    }
  }
  ${lessonFragment}
`;
