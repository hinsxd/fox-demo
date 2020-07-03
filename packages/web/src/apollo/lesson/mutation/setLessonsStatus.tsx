import gql from 'graphql-tag';
import { lessonFragment } from '../fragment/lessonFragment';

export const SET_LESSONS_STATUS_MUTATION = gql`
  mutation SetLessonsStatus(
    $from: DateTime!
    $to: DateTime!
    $status: LessonStatus!
  ) {
    setLessonsStatus(from: $from, to: $to, status: $status) {
      ...lessonFragment
    }
  }
  ${lessonFragment}
`;
