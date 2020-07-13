import { userFragment } from 'apollo/user/fragment/userFragment';
import gql from 'graphql-tag';

export const ME_QUERY = gql`
  query Me {
    me {
      ...userFragment
    }
  }
  ${userFragment}
`;
