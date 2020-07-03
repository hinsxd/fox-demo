import gql from 'graphql-tag';
import { userFragment } from 'apollo/user/fragment/userFragment';
import { lessonFragment } from 'apollo/lesson/fragment/lessonFragment';

export const USER_QUERY = gql`
  query User($id: ID!) {
    user(id: $id) {
      ...userFragment
      bookedLessons {
        ...lessonFragment
      }
    }
  }
  ${lessonFragment}
  ${userFragment}
`;
