import gql from 'graphql-tag';
import { teacherFragment } from 'apollo/teacher/fragment/teacherFragment';

export const lessonFragment = gql`
  fragment lessonFragment on Lesson {
    id
    teacher {
      ...teacherFragment
    }
    start
    end
    comment
    price
    status
    student {
      id
      role
      email
      profile {
        id
        name
      }
    }
    inCart
    cancelReason
    numberOfPeople
  }
  ${teacherFragment}
`;
