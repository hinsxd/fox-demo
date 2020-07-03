import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(theme => ({
  container: {
    // marginTop: '48px',
    paddingTop: '20px',
    paddingBottom: '56px',
    backgroundColor: '#fff'
  }
}));

const MainContainer: React.FC<{}> = ({ children }) => {
  const classes = useStyles();

  return (
    <Container maxWidth="md" className={classes.container}>
      {children}
    </Container>
  );
};

export default MainContainer;
