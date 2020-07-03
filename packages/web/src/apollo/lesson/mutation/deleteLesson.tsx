import gql from 'graphql-tag';

export const DELETE_LESSON_MUTATION = gql`
  mutation DeleteLesson($id: ID!, $cancelReason: String) {
    deleteLesson(id: $id, cancelReason: $cancelReason)
  }
`;
