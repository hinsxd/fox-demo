import gql from 'graphql-tag';
import { teacherFragment } from '../fragment/teacherFragment';

export const UPDATE_TEACHER_MUTATION = gql`
  mutation UpdateTeacher(
    $id: ID!
    $name: String!
    $hourPrice: Int!
    $color: String!
  ) {
    updateTeacher(id: $id, name: $name, hourPrice: $hourPrice, color: $color) {
      ...teacherFragment
    }
  }
  ${teacherFragment}
`;
