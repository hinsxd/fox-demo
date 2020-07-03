import React from 'react';
import { LessonFragmentFragment, LessonStatus } from 'types/graphql';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { getLessonStrings } from 'utils/getLessonStrings';
const LessonButton: React.FC<{
  lesson: LessonFragmentFragment;
  selected: boolean;
} & ButtonProps> = ({ lesson, selected, ...rest }) => {
  const lessonStrings = getLessonStrings(lesson);
  const renderString = `${lessonStrings.start} - ${lessonStrings.end}`;
  return (
    <Button
      variant={selected ? 'contained' : 'outlined'}
      color={lesson.status === LessonStatus.Bookable ? 'primary' : 'secondary'}
      {...rest}
    >
      {renderString}
    </Button>
  );
};
export default LessonButton;
