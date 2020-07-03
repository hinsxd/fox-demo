import gql from 'graphql-tag';

export const REMOVE_FROM_CART_MUTATION = gql`
  mutation RemoveFromCart($id: ID!) {
    removeFromCart(id: $id)
  }
`;
