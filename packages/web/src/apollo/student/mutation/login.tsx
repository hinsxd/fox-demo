import { userFragment } from 'apollo/user/fragment/userFragment';
import gql from 'graphql-tag';
export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ...userFragment
    }
  }
  ${userFragment}
`;
