// Material helpers
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles
} from '@material-ui/core';
// Material icons
import {
  DateRangeOutlined as DateRangeIcon,
  EditOutlined as EditIcon,
  PeopleOutlined as PeopleIcon
} from '@material-ui/icons';
// Externals
import clsx from 'clsx';
import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

// Component styles

type Props = {
  className?: string;
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  logoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '63px',
    flexShrink: 0
  },
  logoLink: {
    fontSize: 0
  },
  logoImage: {
    cursor: 'pointer'
  },
  logoDivider: {
    marginBottom: theme.spacing(2)
  },
  profile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: '100px',
    height: '100px'
  },
  nameText: {
    marginTop: theme.spacing(2)
  },
  bioText: {},
  profileDivider: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  listSubheader: {
    color: theme.palette.text.secondary
  },
  listItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      borderRadius: '4px',
      '& $listItemIcon': {
        color: theme.palette.primary.main,
        marginLeft: '-4px'
      }
    },
    '& + &': {
      marginTop: theme.spacing(1)
    }
  },
  activeListItem: {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    borderRadius: '4px',
    backgroundColor: theme.palette.primary.light,
    '& $listItemText': {
      color: theme.palette.text.primary
    },
    '& $listItemIcon': {
      color: theme.palette.primary.main,
      marginLeft: '-4px'
    }
  },
  listItemIcon: {
    marginRight: 0
  },
  listItemText: {
    fontWeight: 500,
    color: theme.palette.text.secondary
  },
  listDivider: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  }
}));

const NavLinkWithRef = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  (props, ref) => <NavLink innerRef={ref as any} {...props} />
);

const Sidebar: React.FC<Props> = ({ className }) => {
  const classes = useStyles();
  const rootClassName = clsx(classes.root, className);

  return (
    <nav className={rootClassName}>
      <List component="div">
        <ListItem
          activeClassName={classes.activeListItem}
          className={classes.listItem}
          component={NavLinkWithRef}
          to="/admin"
          exact
        >
          <ListItemIcon className={classes.listItemIcon}>
            <DateRangeIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary="Overview"
          />
        </ListItem>

        <ListItem
          activeClassName={classes.activeListItem}
          className={classes.listItem}
          component={NavLinkWithRef}
          to="/admin/visibility"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <EditIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary="Manage Visibility"
          />
        </ListItem>
        <ListItem
          activeClassName={classes.activeListItem}
          className={classes.listItem}
          component={NavLinkWithRef}
          to="/admin/teachers"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary="Manage Teachers"
          />
        </ListItem>
        <ListItem
          activeClassName={classes.activeListItem}
          className={classes.listItem}
          component={NavLinkWithRef}
          to="/admin/users"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary="Manage Users"
          />
        </ListItem>
      </List>
    </nav>
  );
};
export default Sidebar;
