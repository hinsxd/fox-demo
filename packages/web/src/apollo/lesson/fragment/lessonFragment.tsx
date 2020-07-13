import { teacherFragment } from 'apollo/teacher/fragment/teacherFragment';
import gql from 'graphql-tag';

export const lessonFragment = gql`
  fragment lessonFragment on Lesson {
    id
    teacher {
      ...teacherFragment
    }
    start
    end
    comment
    student {
      id
      name
      phone
      emergencyName
      emergencyRelation
      emergencyPhone
    }
  }
  ${teacherFragment}
`;
