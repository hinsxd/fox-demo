// Material components
import { Divider, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

// Component styles
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  company: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(0.5)
  }
}));

type Props = {
  className?: string;
};

const Footer: React.FC<Props> = ({ className }) => {
  const classes = useStyles();
  const rootClassName = clsx(classes.root, className);

  return (
    <div className={rootClassName}>
      <Divider />
      <Typography className={classes.company} variant="body1">
        &copy; Dr. Maths 2019
      </Typography>
      {/* <Typography variant="caption">
        
      </Typography> */}
    </div>
  );
};

export default Footer;
