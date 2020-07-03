import gql from 'graphql-tag';
import { lessonFragment } from '../fragment/lessonFragment';

export const BOOK_LESSONS_MUTATION = gql`
  mutation BookLessons(
    $cartItemIds: [String!]!
    $amount: Int!
    $source: String!
    $ccLast4: String!
  ) {
    bookLessons(
      cartItemIds: $cartItemIds
      amount: $amount
      source: $source
      ccLast4: $ccLast4
    ) {
      ...lessonFragment
    }
  }
  ${lessonFragment}
`;
