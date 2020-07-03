import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  DialogActions,
  Box,
  Typography,
  Link
} from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import {
  useTeachersQuery,
  TeachersQuery,
  useEditLessonMutation,
  useDeleteLessonMutation,
  LessonStatus
} from 'types/graphql';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import { DialogContext } from './Overview';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import clsx from 'clsx';
import { hot } from 'react-hot-loader/root';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  deleteButton: {
    color: '#fff',
    backgroundColor: theme.palette.danger.main,
    '&:hover': {
      backgroundColor: theme.palette.danger.dark
    }
  },
  input: {
    marginBottom: theme.spacing(1.5),
    // width: '100%',
    minWidth: 120
  },
  inputRowElement: {
    flex: 1
  }
}));

type FormState = {
  id: string;
  teacherId: string;
  start: Date | null;
  end: Date | null;
  comment: string;
  status: LessonStatus;
  cancelReason: string;
};

const initialFormState: FormState = {
  id: '',
  teacherId: '',
  start: null,
  end: null,
  comment: '',
  cancelReason: '',
  status: LessonStatus.Hidden
};

type Props = {
  onClose: () => void;
  refetch: () => Promise<any>;
};

const EditLessonDialog: React.FC<Props> = ({ onClose, refetch }) => {
  const classes = useStyles();

  const { mode, lesson } = useContext(DialogContext);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  useEffect(() => {
    if (lesson) {
      const { id, start, end, comment, cancelReason, teacher, status } = lesson;
      setFormState({
        id,
        start,
        end,
        comment,
        status,
        cancelReason,
        teacherId: teacher.id
      });
    } else {
      setFormState(initialFormState);
    }
  }, [lesson]);

  const { data: teachersData } = useTeachersQuery();

  const teachers: TeachersQuery['teachers'] = teachersData?.teachers || [];

  const [editLesson, { loading: editing }] = useEditLessonMutation();
  const [deleteLesson, { loading: deleting }] = useDeleteLessonMutation();
  const loading = editing || deleting;
  const alreadyBooked =
    lesson?.status === LessonStatus.Booked ||
    lesson?.status === LessonStatus.Cancelled;
  const handleEditLesson = async () => {
    if (formState.teacherId !== '' && !!formState.start && !!formState.end) {
      await editLesson({
        variables: formState
      });
      onClose();
      await refetch();
    }
  };

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleDeleteButtonClick = async () => {
    if (lesson?.status === LessonStatus.Booked) {
      setConfirmDialogOpen(true);
    } else if (lesson?.status !== LessonStatus.Cancelled) {
      await deleteLesson({
        variables: { id: formState.id }
      });
      await refetch();
      onClose();
    }
  };

  const confirmDelete = async (confirm: boolean, cancelReason?: string) => {
    if (confirm && cancelReason) {
      await deleteLesson({ variables: { id: formState.id, cancelReason } });
      await refetch();
      onClose();
    }
    setConfirmDialogOpen(false);
  };
  return (
    <>
      <Dialog
        open={mode === 'edit'}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>Edit lesson</DialogTitle>

        <DialogContent>
          {alreadyBooked && lesson?.student && (
            <Box>
              <Box pb={1} display="flex" flexDirection="row">
                <Box flex={1}>
                  <Typography variant="overline">Booked by</Typography>
                  <Typography component="h6">
                    <Link
                      component={RouterLink}
                      to={`/admin/user/${lesson?.student?.id}`}
                    >
                      {lesson?.student?.profile?.name}
                    </Link>
                  </Typography>
                </Box>
                <Box flex={1}>
                  <Typography variant="overline">Number of students</Typography>
                  <Typography component="h6">
                    {lesson?.numberOfPeople || 1}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          <TextField
            id="teacherId"
            select
            className={classes.input}
            disabled={alreadyBooked}
            fullWidth
            label="Teacher"
            value={formState.teacherId}
            onChange={e =>
              setFormState(state => ({
                ...state,
                teacherId: e.target.value
              }))
            }
            SelectProps={{
              native: true
            }}
          >
            <option value=""></option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </TextField>
          <Box display="flex" flexDirection="row">
            <KeyboardDateTimePicker
              disabled={alreadyBooked}
              className={clsx(classes.input, classes.inputRowElement)}
              value={formState.start}
              minutesStep={15}
              autoOk={true}
              openTo="hours"
              format="dd/MM/yyyy HH:mm"
              onChange={date => {
                if (date) {
                  setFormState(state => ({
                    ...state,
                    start: date
                  }));
                }
              }}
              ampm={false}
              label="Starting Time"
            />
            <KeyboardDateTimePicker
              disabled={alreadyBooked}
              className={clsx(classes.input, classes.inputRowElement)}
              value={formState.end}
              minutesStep={15}
              autoOk={true}
              openTo="hours"
              format="dd/MM/yyyy HH:mm"
              onChange={date => {
                if (date)
                  setFormState(state => ({
                    ...state,
                    end: date
                  }));
              }}
              ampm={false}
              label="Ending Time"
            />
          </Box>
          <TextField
            className={classes.input}
            label="Comments"
            placeholder="Add comments"
            value={formState.comment}
            onChange={e => {
              e.persist();
              setFormState(state => ({
                ...state,
                comment: e.target.value
              }));
            }}
            fullWidth
          />{' '}
          {lesson?.status === LessonStatus.Cancelled && (
            <TextField
              className={classes.input}
              label="Cancel Reason"
              placeholder=""
              disabled
              value={formState.cancelReason}
              onChange={e => {
                e.persist();
                setFormState(state => ({
                  ...state,
                  cancelReason: e.target.value
                }));
              }}
              fullWidth
            />
          )}
          <TextField
            className={classes.input}
            id="status"
            select
            label="Lesson Status"
            value={formState.status}
            disabled={alreadyBooked}
            onChange={e => {
              e.persist();
              setFormState(state => ({
                ...state,
                status: e.target.value as LessonStatus
              }));
            }}
            SelectProps={{
              native: true,
              MenuProps: {
                // className: classes.menu,
              }
            }}
            margin="normal"
            fullWidth
          >
            <option value=""></option>
            {Object.keys(LessonStatus).map(status => (
              <option
                key={status}
                value={status}
                disabled={
                  status === LessonStatus.Booked ||
                  status === LessonStatus.Cancelled
                }
              >
                {status}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          {lesson?.status !== LessonStatus.Cancelled && (
            <Button
              className={classes.deleteButton}
              disabled={loading}
              onClick={handleDeleteButtonClick}
              // fullWidth
              variant="contained"
            >
              {lesson?.status === LessonStatus.Booked
                ? 'Cancel Lesson'
                : 'Delete Lesson'}
            </Button>
          )}
          <Button
            // className={classes.input}
            onClick={handleEditLesson}
            disabled={loading}
            // fullWidth
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDeleteDialog
        open={confirmDialogOpen}
        confirmDelete={confirmDelete}
      />
    </>
  );
};

export default hot(EditLessonDialog);
