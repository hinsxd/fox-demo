import gql from 'graphql-tag';
import { lessonFragment } from 'apollo/lesson/fragment/lessonFragment';

export const BOOKED_LESSONS_QUERY = gql`
  query BookedLessons($type: String, $count: Int) {
    me {
      id
      bookedLessons(type: $type, count: $count) {
        ...lessonFragment
      }
      cancelledLessons {
        ...lessonFragment
      }
    }
  }
  ${lessonFragment}
`;
