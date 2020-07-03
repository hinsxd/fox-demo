import { hot } from 'react-hot-loader/root';
import React, { useState, useEffect } from 'react';
import { useAuthContext } from 'context/auth';
import {
  MeDocument,
  useBookLessonsMutation,
  BookedLessonsDocument,
  LessonStatus
} from 'types/graphql';
import {
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  makeStyles,
  Button,
  CardActions
} from '@material-ui/core';
import { useCheckoutDialogContext } from 'context/checkoutDialog';
import MainContainer from 'components/MainContainer';
import CartItemRow from 'components/CartItemRow';
import Layout from './Layout';
import { centsToDollarString } from 'utils/centsToDollarString';

const useStyles = makeStyles(theme => ({
  paper: {
    // padding: theme.spacing(2),
    maxWidth: '720px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(3)
  },
  gridRow: {
    marginBottom: theme.spacing(2)
  },
  button: {
    marginTop: theme.spacing(1)
  }
}));

const Cart = () => {
  // Styles
  const classes = useStyles();

  // Cart Info and derived array
  const { me } = useAuthContext();
  const cartItemIds: string[] =
    me?.cartItems
      .filter(({ lesson }) => lesson.status === LessonStatus.Bookable)
      .map(cartItem => cartItem.id) || [];

  // Selected lessons and calculated total and count
  const [selectedCartItemIds, setSelectedCartItemIds] = useState<string[]>(
    cartItemIds
  );
  // const [commentList, setCommentList] = useState<{ [id: string]: string }>({});
  const selectedCartItems =
    me?.cartItems.filter(({ id }) => selectedCartItemIds.indexOf(id) > -1) ||
    [];
  const total = selectedCartItems.reduce(
    (sum, cartItem) => (sum += cartItem.price),
    0
  );
  const totalString = centsToDollarString(total);

  const count = selectedCartItemIds.length;

  // Toggle select items
  const handleToggle = (value: string) => () => {
    const currentIndex = selectedCartItemIds.indexOf(value);
    const newSelected = [...selectedCartItemIds];

    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedCartItemIds(newSelected);
  };

  // Remove from checked when items are remove from cart
  useEffect(() => {
    const newSelected = selectedCartItemIds.filter(
      cartItemId => cartItemIds.indexOf(cartItemId) > -1
    );
    if (newSelected.length !== selectedCartItemIds.length) {
      setSelectedCartItemIds(newSelected);
    }
  }, [cartItemIds, selectedCartItemIds]);

  // Dialog states
  const { openCheckoutDialog } = useCheckoutDialogContext();

  // GraphQL hooks

  const [bookLessons] = useBookLessonsMutation({
    refetchQueries: [
      { query: BookedLessonsDocument, variables: { type: 'upcoming' } },
      { query: MeDocument }
    ],
    awaitRefetchQueries: true
  });
  const action = async (args: { source: string; ccLast4: string }) => {
    const { source, ccLast4 } = args;
    try {
      await bookLessons({
        variables: {
          cartItemIds: selectedCartItems.map(({ id }) => id),
          amount: total,
          source,
          ccLast4
        }
      });
    } catch (e) {
      throw new Error(e);
    }
  };
  return (
    <Layout view="cart">
      <MainContainer>
        <Box maxWidth="600px" mx="auto">
          <Card variant="outlined">
            <CardHeader title="Select lessons to checkout" />
            <>
              <List>
                <Divider />
                {me?.cartItems.map(cartItem => (
                  <CartItemRow
                    cartItem={cartItem}
                    key={cartItem.lesson.id}
                    toggle={handleToggle(cartItem.id)}
                    disabled={cartItem.lesson.status !== 'Bookable'}
                    selected={selectedCartItemIds.includes(cartItem.id)}
                  ></CartItemRow>
                ))}

                <ListItem>
                  <CardContent>
                    <ListItemText primary=" " />
                    <ListItemSecondaryAction>
                      <Typography
                        variant="h5"
                        component="span"
                        color="textSecondary"
                        align="right"
                      >
                        Total:
                      </Typography>
                      <Typography variant="h5" component="span">
                        {totalString}
                      </Typography>
                    </ListItemSecondaryAction>
                  </CardContent>
                </ListItem>
              </List>
            </>
            <CardActions>
              <Button
                disabled={!count}
                variant="contained"
                color="primary"
                className={classes.button}
                fullWidth
                onClick={() => {
                  openCheckoutDialog({
                    title: `Checkout ${selectedCartItemIds.length} lessons: ${totalString}`,
                    action
                  });
                }}
              >
                Proceed to checkout
              </Button>
            </CardActions>
          </Card>
        </Box>
      </MainContainer>
    </Layout>
  );
};

export default hot(Cart);
