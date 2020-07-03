import gql from 'graphql-tag';
import { lessonFragment } from '../fragment/lessonFragment';

export const LESSONS_QUERY = gql`
  query Lessons($start: DateTime!, $end: DateTime!) {
    lessons(start: $start, end: $end) {
      ...lessonFragment
    }
  }
  ${lessonFragment}
`;
