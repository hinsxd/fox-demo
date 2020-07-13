import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import clsx from 'clsx';
import { addWeeks, format } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import { useAddLessonMutation, useTeachersQuery } from 'types/graphql';
import { DialogContext } from './Overview';

const useStyles = makeStyles((theme) => ({
  input: {
    marginBottom: theme.spacing(1.5),
    minWidth: 120,
  },
  inputRowElement: {
    flex: 1,
  },
}));
type FormState = {
  teacherId: string;
  start: Date | null;
  end: Date | null;
  repeatWeeks: number;
  comment: string;
};

const initialFormState: FormState = {
  teacherId: '',
  start: null,
  end: null,
  repeatWeeks: 1,
  comment: '',
};

const AddLessonDialog: React.FC<{
  onClose: () => void;
  refetch: () => Promise<any>;
}> = ({ onClose, refetch }) => {
  const { mode, start, end } = useContext(DialogContext);
  const [formState, setFormState] = useState<FormState>(initialFormState);

  useEffect(() => {
    setFormState((state) => ({ ...state, start, end }));
  }, [start, end]);

  const { data: teachersData } = useTeachersQuery();

  const teachers = teachersData?.teachers || [];

  useEffect(() => {
    if (teachers.length > 0)
      setFormState((state) => ({
        ...state,
        teacherId: teachers[0].id,
      }));
  }, [teachers]);

  const [addLesson, addLessonMeta] = useAddLessonMutation();

  const classes = useStyles();
  const handleAddLesson = async () => {
    if (formState.teacherId !== '') {
      await addLesson({ variables: formState });
      await refetch();
      onClose();
      setFormState({
        ...initialFormState,
        ...(teachers.length > 0 && { teacherId: teachers[0].id }),
      });
    }
  };

  const addRepeatWeeks = () => {
    setFormState((state) => ({ ...state, repeatWeeks: state.repeatWeeks + 1 }));
  };
  const minusRepeatWeeks = () => {
    setFormState((state) => ({
      ...state,
      repeatWeeks: Math.max(state.repeatWeeks - 1, 1),
    }));
  };
  const until = formState.start
    ? addWeeks(formState.start, formState.repeatWeeks - 1)
    : formState.start;
  return (
    <Dialog open={mode === 'add'} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add lesson</DialogTitle>
      <DialogContent>
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
            className={classes.input}
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
        <div className={classes.input}>
          <Typography component="span">Recurring: </Typography>
          <IconButton
            onClick={minusRepeatWeeks}
            disabled={formState.repeatWeeks <= 1}
          >
            <Remove />
          </IconButton>
          <Typography component="span">{formState.repeatWeeks}</Typography>
          <IconButton onClick={addRepeatWeeks}>
            <Add />
          </IconButton>
          {formState.repeatWeeks <= 1 && 'week'}
          {until && formState.repeatWeeks > 1 && (
            <Typography component="span">
              {`week${formState.repeatWeeks > 1 ? 's' : ''} until ${format(
                until,
                'yyyy-MM-dd'
              )}`}
            </Typography>
          )}
        </div>
        <TextField
          className={classes.input}
          label="Comments"
          placeholder="Add comments"
          value={formState.comment}
          onChange={(e) => {
            setFormState({
              ...formState,
              comment: e.target.value,
            });
          }}
          fullWidth
        />

        <Button
          type="submit"
          disabled={addLessonMeta.loading}
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleAddLesson}
        >
          Add lesson
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddLessonDialog;
