import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  DialogActions,
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';

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

type ConfirmDeleteDialogProps = {
  open: boolean;
  confirmDelete: (confirm: boolean, cancelReason?: string) => void;
};
const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  confirmDelete,
}) => {
  const classes = useStyles();
  const [cancelReason, setCancelReason] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (open) {
      setCancelReason('');
      setConfirmPassword('');
    }
  }, [open]);
  return (
    <Dialog open={open} maxWidth="xs">
      <DialogTitle>Are you sure to cancel the lesson?</DialogTitle>
      <DialogContent>
        <TextField
          className={classes.input}
          label="Cancel reason"
          value={cancelReason}
          onChange={(e) => {
            setCancelReason(e.target.value);
          }}
          fullWidth
        />
        <TextField
          className={classes.input}
          label="Enter Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={cancelReason.length === 0 || confirmPassword !== 'Copper29'}
          className={classes.deleteButton}
          onClick={() => confirmDelete(true, cancelReason)}
          fullWidth
          variant="contained"
        >
          Yes
        </Button>
        <Button
          // className={classes.input}
          onClick={() => confirmDelete(false)}
          fullWidth
          variant="contained"
          color="primary"
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
