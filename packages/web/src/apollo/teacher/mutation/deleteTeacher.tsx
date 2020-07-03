import gql from 'graphql-tag';
import { teacherFragment } from '../fragment/teacherFragment';

export const DELETE_TEACHER_MUTATION = gql`
  mutation DeleteTeacher($id: ID!) {
    deleteTeacher(id: $id)
  }
  ${teacherFragment}
`;
