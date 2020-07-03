// Material helpers
import { IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
// Material icons
import { Menu as MenuIcon, Input as InputIcon } from '@material-ui/icons';
// Externals
import clsx from 'clsx';
import React from 'react';
import { useAuthContext } from 'context/auth';

type Props = {
  title: string;
  className: string;
  // isSidebarOpen: boolean;
  onToggleSidebar: Function;
};

const useStyles = makeStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.border}`,
    backgroundColor: theme.palette.common.white,
    display: 'flex',
    alignItems: 'center',
    height: '64px',
    zIndex: theme.zIndex.appBar
  },
  toolbar: {
    minHeight: 'auto',
    width: '100%'
  },
  title: {
    marginLeft: theme.spacing(1)
  },
  menuButton: {
    marginLeft: '-4px'
  },
  notificationsButton: {
    marginLeft: 'auto'
  },
  signOutButton: {
    marginLeft: 'auto'
  }
}));

const Topbar: React.FC<Props> = ({
  className,
  title,
  // isSidebarOpen,
  onToggleSidebar
}) => {
  const classes = useStyles();
  const rootClassName = clsx(classes.root, className);
  const { logout } = useAuthContext();
  return (
    <>
      <div className={rootClassName}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            className={classes.menuButton}
            onClick={() => onToggleSidebar()}
            // variant="text"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h4">
            {title}
          </Typography>

          <IconButton
            className={classes.signOutButton}
            onClick={async () => await logout()}
          >
            <InputIcon />
          </IconButton>
        </Toolbar>
      </div>
    </>
  );
};

export default Topbar;
