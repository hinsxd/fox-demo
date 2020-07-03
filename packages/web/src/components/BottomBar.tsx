import React from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  Hidden
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { ShoppingCart, NoteAdd, Home } from '@material-ui/icons';
import { useRouter } from 'utils/useRouter';
import { useAuthContext } from 'context/auth';
type Props = {
  view: string;
};
const useStyles = makeStyles(theme => ({
  root: {
    width: '100vw',
    position: 'fixed',
    bottom: 0
  },
  padding: {
    padding: theme.spacing(0, 2)
  }
}));
const BottomBar: React.FC<Props> = ({ view }) => {
  const classes = useStyles();
  const { history } = useRouter();

  const { me } = useAuthContext();
  const cartLength = me?.cartItems.length || 0;
  return (
    <Hidden smUp>
      <BottomNavigation value={view} showLabels className={classes.root}>
        <BottomNavigationAction
          disableRipple
          disableTouchRipple
          label="Home"
          value="home"
          icon={<Home />}
          onClick={() => history.push('/')}
        />
        <BottomNavigationAction
          disableRipple
          disableTouchRipple
          label="Book"
          value="lessons"
          icon={<NoteAdd />}
          onClick={() => history.push('/lessons')}
        />
        {/* <BottomNavigationAction
          disableRipple
          disableTouchRipple
          label="My lessons"
          value="mylessons"
          icon={<Schedule />}
          onClick={() => history.push('/mylessons')}
        /> */}
        <BottomNavigationAction
          disableRipple
          disableTouchRipple
          label={
            <Badge
              color="secondary"
              className={classes.padding}
              badgeContent={cartLength}
              showZero={false}
            >
              Cart
            </Badge>
          }
          value="cart"
          icon={<ShoppingCart />}
          onClick={() => history.push('/cart')}
        />
      </BottomNavigation>
    </Hidden>
  );
};

export default BottomBar;
