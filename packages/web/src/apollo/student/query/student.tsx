import { studentFragment } from 'apollo/student/fragment/studentFragment';
import gql from 'graphql-tag';

export const USER_QUERY = gql`
  query Student($id: ID!) {
    student(id: $id) {
      ...studentFragment
    }
  }
  ${studentFragment}
`;
