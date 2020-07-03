import gql from 'graphql-tag';
import { lessonFragment } from 'apollo/lesson/fragment/lessonFragment';

export const cartItemFragment = gql`
  fragment cartItemFragment on CartItem {
    id
    lesson {
      ...lessonFragment
    }
    numberOfPeople
    price
  }
  ${lessonFragment}
`;
