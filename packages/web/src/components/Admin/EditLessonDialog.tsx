import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import { Link as RouterLink } from 'react-router-dom';
import {
  useDeleteLessonMutation,
  useEditLessonMutation,
  useStudentsQuery,
  useTeachersQuery,
} from 'types/graphql';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { DialogContext } from './Overview';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  deleteButton: {
    color: '#fff',
    backgroundColor: theme.palette.danger.main,
    '&:hover': {
      backgroundColor: theme.palette.danger.dark,
    },
  },
  input: {
    marginBottom: theme.spacing(1.5),
    // width: '100%',
    minWidth: 120,
  },
  inputRowElement: {
    flex: 1,
  },
}));

type FormState = {
  id: string;
  studentId: string | null;
  teacherId: string;
  start: Date | null;
  end: Date | null;
  comment: string;
};

const initialFormState: FormState = {
  id: '',
  studentId: null,
  teacherId: '',
  start: null,
  end: null,
  comment: '',
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
      const { id, start, end, comment, teacher, student } = lesson;
      setFormState({
        id,
        start,
        studentId: student?.id || null,
        end,
        comment,
        teacherId: teacher.id,
      });
    } else {
      setFormState(initialFormState);
    }
  }, [lesson]);

  const { data: teachersData } = useTeachersQuery();
  const { data: studentsData } = useStudentsQuery();

  const teachers = teachersData?.teachers || [];
  const students = studentsData?.students || [];

  const [editLesson, { loading: editing }] = useEditLessonMutation();
  const [deleteLesson, { loading: deleting }] = useDeleteLessonMutation();
  const loading = editing || deleting;

  const handleEditLesson = async () => {
    if (formState.teacherId !== '' && !!formState.start && !!formState.end) {
      await editLesson({
        variables: {
          ...formState,
          studentId: formState.studentId === '' ? null : formState.studentId,
        },
      });
      onClose();
      await refetch();
    }
  };

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleDeleteButtonClick = async () => {
    await deleteLesson({
      variables: { id: formState.id },
    });
    await refetch();
    onClose();
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
          {lesson?.student && (
            <Box>
              <Box pb={1} display="flex" flexDirection="row">
                <Box flex={1}>
                  <Typography variant="overline">Booked by</Typography>
                  <Typography component="h6">
                    <Link
                      component={RouterLink}
                      to={`/admin/student/${lesson?.student?.id}`}
                    >
                      {lesson?.student?.name}
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          <TextField
            id="teacherId"
            select
            className={classes.input}
            fullWidth
            label="Teacher"
            value={formState.teacherId}
            onChange={(e) =>
              setFormState((state) => ({
                ...state,
                teacherId: e.target.value,
              }))
            }
            SelectProps={{
              native: true,
            }}
          >
            <option value=""></option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </TextField>
          <TextField
            id="studentId"
            select
            className={classes.input}
            fullWidth
            label="Student"
            value={formState.studentId === null ? '' : formState.studentId}
            onChange={(e) =>
              setFormState((state) => ({
                ...state,
                studentId: e.target.value,
              }))
            }
            SelectProps={{
              native: true,
            }}
          >
            <option value=""></option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </TextField>
          <Box display="flex" flexDirection="row">
            <KeyboardDateTimePicker
              className={clsx(classes.input, classes.inputRowElement)}
              value={formState.start}
              minutesStep={15}
              autoOk={true}
              openTo="hours"
              format="dd/MM/yyyy HH:mm"
              onChange={(date) => {
                if (date) {
                  setFormState((state) => ({
                    ...state,
                    start: date,
                  }));
                }
              }}
              ampm={false}
              label="Starting Time"
            />
            <KeyboardDateTimePicker
              className={clsx(classes.input, classes.inputRowElement)}
              value={formState.end}
              minutesStep={15}
              autoOk={true}
              openTo="hours"
              format="dd/MM/yyyy HH:mm"
              onChange={(date) => {
                if (date)
                  setFormState((state) => ({
                    ...state,
                    end: date,
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
            onChange={(e) => {
              e.persist();
              setFormState((state) => ({
                ...state,
                comment: e.target.value,
              }));
            }}
            fullWidth
          />{' '}
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.deleteButton}
            disabled={loading}
            onClick={handleDeleteButtonClick}
            // fullWidth
            variant="contained"
          >
            Delete Lesson
          </Button>
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
