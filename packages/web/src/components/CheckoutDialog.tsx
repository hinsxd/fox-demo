import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import { makeStyles } from '@material-ui/core/styles';
import { Check } from '@material-ui/icons';
import clsx from 'clsx';
import { useCheckoutDialogContext } from 'context/checkoutDialog';
import delay from 'delay';
import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSnackbar } from 'notistack';
const useStyles = makeStyles(theme => ({
  dialog: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: 'none',
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`
  },
  button: {
    marginTop: theme.spacing(2)
  },
  buttonSuccess: {
    backgroundColor: green[600]
  },
  buttonProgress: {
    color: green[500]
  }
}));

const CheckoutDialog: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();
  const [cardOK, setCardOK] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    title,
    closeCheckoutDialog,
    action,
    open
  } = useCheckoutDialogContext();
  useEffect(() => {
    setCardOK(false);
    setLoading(false);
    setSuccess(false);
  }, [open]);
  const handleSubmit = async (e?: any) => {
    if (!stripe || !elements || !cardOK) {
      // Stripe.js has not yet loaded.
      // Make  sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setLoading(true);
    const card = elements.getElement(CardElement);
    if (!card) {
      console.error('ERROR');
    } else {
      const { token, error } = await stripe.createToken(card);
      if (error) {
        // Show error to your customer.
        console.error(error.message);
        setSuccess(false);
      } else if (!token) {
        console.error('Server error');
        setSuccess(false);
      } else {
        try {
          await action({
            source: token.id,
            ccLast4: token.card!.last4
          });

          setSuccess(true);
          enqueueSnackbar('Success', { variant: 'success' });
          await delay(1500);
          closeCheckoutDialog();
        } catch (e) {
          enqueueSnackbar(e.message.split('Error: ').reverse()[0], {
            variant: 'error'
          });
          setSuccess(false);
        }
      }
    }
    setLoading(false);
  };
  return (
    <Dialog open={open} onClose={closeCheckoutDialog} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <CardElement
          options={{ hidePostalCode: true }}
          // hidePostalCode
          onChange={e => setCardOK(e.complete && !e.error && !e.empty)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          fullWidth
          variant="contained"
          disabled={loading || !cardOK}
          color="primary"
          onClick={() => handleSubmit()}
          className={clsx(classes.button, { [classes.buttonSuccess]: success })}
        >
          {loading ? (
            <CircularProgress size={24} className={classes.buttonProgress} />
          ) : success ? (
            <Check />
          ) : (
            'Pay'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutDialog;
