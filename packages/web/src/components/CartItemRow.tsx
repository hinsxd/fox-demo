import React from 'react';
import {
  useRemoveFromCartMutation,
  MeDocument,
  CartItemFragmentFragment,
  useSetNumberOfPeopleMutation,
  LessonStatus,
} from 'types/graphql';
import {
  Typography,
  Box,
  ListItem,
  makeStyles,
  createStyles,
  Checkbox,
  Select,
  FormControl,
  InputLabel,
  Backdrop,
  CircularProgress,
  Button,
} from '@material-ui/core';
import { getLessonStrings } from 'utils/getLessonStrings';
import { AccessTime as TimeIcon, Event as DateIcon } from '@material-ui/icons';
import { centsToDollarString } from 'utils/centsToDollarString';

const useStyles = makeStyles((theme) =>
  createStyles({
    backdrop: {
      position: 'absolute',
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    select: {
      marginLeft: 'auto',
      minWidth: 50,
    },
  })
);

const priceArr = [70000, 50000, 40000, 30000];

const CartItemRow: React.FC<{
  cartItem: CartItemFragmentFragment;
  toggle: () => void;
  selected: boolean;
  disabled: boolean;
}> = ({ cartItem, toggle, selected, disabled }) => {
  const classes = useStyles();

  const { lesson, numberOfPeople, price } = cartItem;

  const [
    setNumberOfPeople,
    { loading: settingNumberOfPeople },
  ] = useSetNumberOfPeopleMutation();

  const [
    removeFromCart,
    { loading: removingFromCart },
  ] = useRemoveFromCartMutation({
    refetchQueries: [{ query: MeDocument }],
  });

  const handleChange = async (e: React.ChangeEvent<{ value: unknown }>) => {
    if (e.target.value !== numberOfPeople)
      await setNumberOfPeople({
        variables: {
          lessonId: lesson.id,
          numberOfPeople: parseInt(e.target.value as string),
        },
      });
  };
  return (
    <ListItem divider>
      <Backdrop
        className={classes.backdrop}
        open={settingNumberOfPeople || removingFromCart}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Checkbox
        size="small"
        edge="start"
        onClick={toggle}
        disabled={disabled}
        checked={selected}
        tabIndex={-1}
        inputProps={{ 'aria-labelledby': lesson.id }}
      />
      <Box>
        <Typography
          variant="caption"
          color={'textSecondary'}
          style={{
            marginRight: 3,
            display: 'inline-flex',
            verticalAlign: 'middle',
          }}
        >
          <DateIcon fontSize="small" />
          {getLessonStrings(lesson).date}
        </Typography>
        <Typography
          variant="caption"
          color={'textSecondary'}
          style={{
            marginRight: 3,
            display: 'inline-flex',
            verticalAlign: 'middle',
          }}
        >
          <TimeIcon fontSize="small" />
          {`${getLessonStrings(lesson).start} - ${
            getLessonStrings(lesson).end
          }`}
        </Typography>
        {lesson.status !== LessonStatus.Bookable && (
          <Typography variant="body2">(Not bookable)</Typography>
        )}

        <Box py={1} flexDirection="column">
          <Typography variant="h6" color={'textPrimary'} component="span">
            {centsToDollarString(price)}
          </Typography>
          <Typography
            variant="caption"
            color={'textSecondary'}
            component="span"
          >
            {' '}
            ({centsToDollarString(priceArr[numberOfPeople - 1])}
            /student /hr)
          </Typography>
        </Box>

        <Button
          variant="text"
          color="secondary"
          size="small"
          onClick={() =>
            removeFromCart({
              variables: { id: lesson.id },
            })
          }
        >
          Remove
        </Button>
      </Box>
      <FormControl className={classes.select}>
        <InputLabel id={`${lesson.id}-number-of-people-label`}>
          students
        </InputLabel>
        <Select
          native
          label="students"
          id={`${lesson.id}-number-of-people-label`}
          value={numberOfPeople}
          onChange={handleChange}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </Select>
      </FormControl>
    </ListItem>
  );
};

export default CartItemRow;
