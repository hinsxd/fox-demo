import gql from 'graphql-tag';
import { userFragment } from 'apollo/user/fragment/userFragment';

export const ME_QUERY = gql`
  query Me {
    me {
      ...userFragment
    }
  }
  ${userFragment}
`;
