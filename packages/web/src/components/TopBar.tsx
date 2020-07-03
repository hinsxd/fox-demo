import {
  AppBar,
  Badge,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AccountCircle } from '@material-ui/icons';
import { useAuthContext } from 'context/auth';
import React, { useState } from 'react';
import { useRouter } from 'utils/useRouter';

type Props = {
  view: string;
};
const useStyles = makeStyles((theme) => ({
  tabs: {
    marginLeft: 'auto',
  },
  tabItem: {
    minWidth: '100px',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  container: {
    marginTop: '48px',
    paddingTop: '10px',
    backgroundColor: '#fff',
  },
  appBar: {
    backgroundColor: '#fff',
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    // boxShadow: `0px 2px 2px 2px #eeeeee`
  },
  padding: {
    padding: theme.spacing(0, 2),
  },
}));

const TopBar: React.FC<Props> = ({ view }) => {
  const { history } = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = !!anchorEl;

  function handleMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const { me, logout } = useAuthContext();
  const cartLength = me?.cartItems.length || 0;
  const classes = useStyles();

  return (
    <AppBar
      elevation={1}
      position="sticky"
      color="default"
      className={classes.appBar}
    >
      <Container maxWidth="lg">
        <Toolbar variant="dense">
          <Typography variant="h6" noWrap>
            Booking Demo
          </Typography>

          <Tabs
            value={view}
            className={classes.tabs}
            indicatorColor="primary"
            scrollButtons="on"
          >
            <Tab
              label="Home"
              value="home"
              disableRipple
              className={classes.tabItem}
              onClick={() => history.push('/')}
            />
            <Tab
              label="Book"
              value="lessons"
              disableRipple
              className={classes.tabItem}
              onClick={() => history.push('/lessons')}
            />
            {/* <Tab
              label="My lessons"
              value="mylessons"
              disableRipple
              className={classes.tabItem}
              onClick={() => history.push('/mylessons')}
            /> */}
            <Tab
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
              disableRipple
              className={classes.tabItem}
              onClick={() => history.push('/cart')}
            />
          </Tabs>
          {me && (
            <div>
              <IconButton
                aria-label="User account"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem>{me.email}</MenuItem>
                <MenuItem onClick={() => history.push('/settings/profile')}>
                  My Profile
                </MenuItem>
                <MenuItem onClick={() => logout()}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopBar;
