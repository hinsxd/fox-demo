import React, { useState } from 'react';

// Externals
import clsx from 'clsx';

// Material helpers
import {
  makeStyles,
  useMediaQuery,
  useTheme,
  Toolbar
} from '@material-ui/core';

// Material components
import { Drawer } from '@material-ui/core';

// Custom components
import { Sidebar, Topbar, Footer } from './components';

const useStyles = makeStyles(theme => ({
  topbar: {
    position: 'fixed',
    width: '100%',
    top: 0,
    left: 0,
    right: 'auto',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  topbarShift: {
    marginLeft: '271px',
    width: 'calc(-271px + 100vw)'
  },
  drawerPaper: {
    zIndex: 1200,
    width: '271px'
  },
  sidebar: {
    width: '270px'
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '100vh',
    minHeight: '100vh'
  },
  content: {
    flex: 1,

    backgroundColor: theme.palette.background.default,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  contentShift: {
    marginLeft: '270px'
  },
  footer: {
    flex: 0
  }
}));

type Props = {
  title: string;
};

const Dashboard: React.FC<Props> = ({ title, children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isOpen, setIsOpen] = useState(!isMobile);

  const shiftTopbar = isOpen && !isMobile;
  const shiftContent = isOpen && !isMobile;

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleToggleOpen = () => {
    setIsOpen(prevState => !prevState);
  };
  return (
    <>
      <Topbar
        className={clsx(classes.topbar, {
          [classes.topbarShift]: shiftTopbar
        })}
        // isSidebarOpen={isOpen}
        onToggleSidebar={handleToggleOpen}
        title={title}
      />
      <Toolbar />
      <Drawer
        anchor="left"
        classes={{ paper: classes.drawerPaper }}
        onClose={handleClose}
        open={isOpen}
        variant={isMobile ? 'temporary' : 'persistent'}
      >
        <Sidebar className={classes.sidebar} />
      </Drawer>

      <div className={classes.wrapper}>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: shiftContent
          })}
        >
          {children}
        </main>
        <Footer className={classes.footer} />
      </div>
    </>
  );
};

export default Dashboard;
