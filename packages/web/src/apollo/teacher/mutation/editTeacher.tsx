import gql from 'graphql-tag';
import { teacherFragment } from '../fragment/teacherFragment';

export const EDIT_TEACHER_MUTATION = gql`
  mutation EditTeacher($id: ID!, $name: String!, $hourPrice: Int!) {
    editTeacher(id: $id, name: $name, hourPrice: $hourPrice) {
      ...teacherFragment
    }
  }
  ${teacherFragment}
`;
