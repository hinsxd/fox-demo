import { userFragment } from 'apollo/user/fragment/userFragment';
import gql from 'graphql-tag';

export const USER_QUERY = gql`
  query User($id: ID!) {
    user(id: $id) {
      ...userFragment
    }
  }
  ${userFragment}
`;
