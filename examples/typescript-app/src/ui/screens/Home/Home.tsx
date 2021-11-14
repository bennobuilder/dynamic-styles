import React from 'react';
import useStyles from './Home.styles';
import Button from '../../components/Button';
import { css } from '@emotion/react';

const Home: React.FC = () => {
  const [toggled, setToggled] = React.useState(false);
  const { classes, cx } = useStyles({ toggled });

  return (
    <div className={classes.root}>
      <p className={cx({ [classes.bounce]: toggled }, classes.text)}>
        Hello world
      </p>
      <Button
        color={'#4f5be8'}
        radius={20}
        onClick={() => setToggled(!toggled)}
      />
      <Button
        onClick={() => setToggled(!toggled)}
        styles={{
          root: css`
            background: rebeccapurple;
          `,
        }}
      />
    </div>
  );
};

export default Home;
