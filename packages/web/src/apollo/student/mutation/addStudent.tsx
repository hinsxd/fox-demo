import gql from 'graphql-tag';
import { studentFragment } from '../fragment/studentFragment';

export const ADD_STUDENT_MUTATION = gql`
  mutation AddStudent(
    $name: String!
    $phone: String
    $emergencyName: String
    $emergencyRelation: String
    $emergencyPhone: String
    $detailedAddress: String
  ) {
    addStudent(
      name: $name
      phone: $phone
      emergencyName: $emergencyName
      emergencyRelation: $emergencyRelation
      emergencyPhone: $emergencyPhone
      detailedAddress: $detailedAddress
    ){
      ...studentFragment
    }
    ${studentFragment}
  }
`;
