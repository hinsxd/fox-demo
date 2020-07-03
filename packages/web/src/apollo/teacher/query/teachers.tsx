import gql from 'graphql-tag'
import { teacherFragment } from '../fragment/teacherFragment';

export const TEACHERS_QUERY = gql`
  query Teachers {
    teachers {
      ...teacherFragment
    }
  }
  ${teacherFragment}
`;
