import gql from 'graphql-tag';

export const ADD_TO_CART_MUTATION = gql`
  mutation AddToCart($id: ID!) {
    addToCart(id: $id)
  }
`;
