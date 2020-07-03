import gql from 'graphql-tag';
import { lessonFragment } from '../fragment/lessonFragment';

export const LESSONS_QUERY = gql`
  query Lessons {
    lessons {
      ...lessonFragment
    }
  }
  ${lessonFragment}
`;
