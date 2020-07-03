import gql from 'graphql-tag'
import { teacherFragment } from '../fragment/teacherFragment';

export const ADD_TEACHER_MUTATION = gql`
  mutation AddTeacher($name: String!, $hourPrice: Int!) {
    addTeacher(name: $name, hourPrice: $hourPrice) {
      ...teacherFragment
    }
  }
  ${teacherFragment}
`;
