import gql from 'graphql-tag';
import { lessonFragment } from 'apollo/lesson/fragment/lessonFragment';
import { cartItemFragment } from 'apollo/cartItem/fragment/cartItemFragment';

export const userFragment = gql`
  fragment userFragment on User {
    id
    role
    email
    username
    profile {
      id
      name
      phone
      email
      emergencyName
      emergencyRelation
      emergencyPhone
      # region
      # district
      # street
      detailedAddress
    }
    cart {
      ...lessonFragment
    }
    cartItems {
      ...cartItemFragment
    }
  }
  ${lessonFragment}
  ${cartItemFragment}
`;
