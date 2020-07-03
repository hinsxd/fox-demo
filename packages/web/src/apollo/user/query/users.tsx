import gql from 'graphql-tag';
import { userFragment } from 'apollo/user/fragment/userFragment';

export const USERS_QUERY = gql`
  query Users {
    users {
      ...userFragment
    }
  }
  ${userFragment}
`;
