import gql from 'graphql-tag';
import { cartItemFragment } from '../fragment/cartItemFragment';

export const SET_NUMBER_OF_PEOPLE_MUTATION = gql`
  mutation SetNumberOfPeople($lessonId: ID!, $numberOfPeople: Int!) {
    setNumberOfPeople(lessonId: $lessonId, numberOfPeople: $numberOfPeople) {
      ...cartItemFragment
    }
  }
  ${cartItemFragment}
`;
