import gql from 'graphql-tag';
import { lessonFragment } from '../fragment/lessonFragment';

export const SET_COMMENT_MUTATION = gql`
  mutation SetComment($id: ID!, $comment: String!) {
    setComment(id: $id, comment: $comment) {
      ...lessonFragment
    }
  }
  ${lessonFragment}
`;
