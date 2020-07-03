import gql from 'graphql-tag'
import { lessonFragment } from '../fragment/lessonFragment';

export const SWAP_LESSONS_MUTATION = gql`
  mutation SwapLesson(
    $fromId: ID!
    $toId: ID!
    $source: String!
    $ccLast4: String!
  ) {
    swapLesson(
      fromId: $fromId
      toId: $toId
      source: $source
      ccLast4: $ccLast4
    ) {
      ...lessonFragment
    }
  }
  ${lessonFragment}
`;
