import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  TextField,
  useMediaQuery,
  useTheme,
  IconButton,
  makeStyles
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { useLessonDialogContext } from 'context/lessonDialog';
import React, { useState, useEffect } from 'react';
import { getLessonStrings } from 'utils/getLessonStrings';
import SwapLesson from './SwapLesson';
import { useSetCommentMutation } from 'types/graphql';

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}));

const LessonDialogComponent: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { open, closeDialog, lesson } = useLessonDialogContext();

  const [comment, setComment] = useState(lesson?.comment || '');
  useEffect(() => {
    if (lesson) {
      setComment(lesson.comment);
    }
  }, [lesson]);
  const [swapping, setSwapping] = useState(false);
  const openSwap = () => setSwapping(true);
  const closeSwap = () => setSwapping(false);
  const closeAll = () => {
    closeDialog();
    closeSwap();
  };

  const [setCommentMutation, setCommentMutationMeta] = useSetCommentMutation();

  const handleSaveComment = async () => {
    if (lesson) {
      await setCommentMutation({
        variables: {
          id: lesson.id,
          comment
        }
      });
    }
    closeDialog();
  };
  return (
    <Dialog
      open={open}
      onClose={closeAll}
      maxWidth={!swapping ? 'xs' : 'sm'}
      fullWidth
      fullScreen={isMobile}
    >
      <IconButton className={classes.closeButton} onClick={closeAll}>
        <CloseIcon />
      </IconButton>
      {lesson ? (
        swapping ? (
          <>
            <DialogTitle>Choose target lesson</DialogTitle>
            <SwapLesson selectedId={lesson.id} onClose={closeAll} />
            <DialogActions>
              <Button onClick={closeSwap}>Cancel</Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Lesson Detail</DialogTitle>
            <List>
              <ListItem>
                <ListItemText
                  primary="Date"
                  secondary={getLessonStrings(lesson).date}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Time"
                  secondary={`${getLessonStrings(lesson).start} - ${
                    getLessonStrings(lesson).end
                  }`}
                />
              </ListItem>
              {/* <ListItem>
                <ListItemText primary="Tutor" secondary={lesson.teacher.name} />
              </ListItem> */}
              <ListItem>
                <TextField
                  label="Remarks"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
              </ListItem>
            </List>
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveComment}
                disabled={setCommentMutationMeta.loading}
              >
                Save
              </Button>
              <Button onClick={openSwap}>Change Time</Button>
            </DialogActions>
          </>
        )
      ) : (
        <div></div>
      )}
    </Dialog>
  );
};

export default LessonDialogComponent;
