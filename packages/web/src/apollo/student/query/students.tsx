import { studentFragment } from 'apollo/student/fragment/studentFragment';
import gql from 'graphql-tag';

export const USERS_QUERY = gql`
  query Students {
    students {
      ...studentFragment
    }
  }
  ${studentFragment}
`;
