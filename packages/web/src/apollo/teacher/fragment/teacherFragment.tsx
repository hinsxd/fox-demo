import gql from 'graphql-tag'

export const teacherFragment = gql`
  fragment teacherFragment on Teacher {
    id
    name
    hourPrice
    color
  }
`;
