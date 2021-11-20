import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import styleSheet from './src/styles';
import { css } from '@emotion/native';
import { css as reactCss } from '@emotion/react';

const useStyles = styleSheet.withParams().create(({ params }) => ({
  root: {
    flex: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const App = () => {
  const { classes } = useStyles({});

  console.log({
    classes,
    nativeCss: css`
      background-color: red;
      font-weight: bold;
    `,
    reactCss: reactCss`
      background-color: red;
      font-weight: bold;
    `,
  });

  return (
    <View>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default App;
