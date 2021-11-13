import React from 'react';
import useStyles from './Home.styles';

const Home: React.FC = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <p className={classes.text}>Hello world</p>
    </div>
  );
};

export default Home;
