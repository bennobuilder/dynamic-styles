import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import styleSheet from './src/styles';
import { css } from '@emotion/native';

const useStyles = styleSheet.createStyles(true, ({ params }) => ({
  root: {
    flex: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: css`
    color: red;
  `,
}));

const App = () => {
  const { classes } = useStyles({});

  console.log({
    classes,
    nativeCss: css`
      background-color: red;
      font-weight: bold;
    `,
  });

  return (
    <View style={classes.root}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default App;
