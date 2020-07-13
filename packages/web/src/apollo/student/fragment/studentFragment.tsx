import gql from 'graphql-tag';

export const studentFragment = gql`
  fragment studentFragment on Student {
    id
    name
    phone
    emergencyName
    emergencyRelation
    emergencyPhone
  }
`;
