import gql from 'graphql-tag';

export const CHECK_UESRNAME_USED_QUERY = gql`
  query CheckUsernameUsed($username: String!) {
    checkUsernameUsed(username: $username)
  }
`;
