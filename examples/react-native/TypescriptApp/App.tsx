import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styleSheet from './src/styles';
import { css } from '@emotion/native';

const useStyles = styleSheet
  .withParams<{ color: string }>()
  .create(({ params }) => ({
    container: css`
      flex: 1;
      padding: 34px;
      background-color: #eaeaea;
    `,
    title: {
      marginTop: 16,
      paddingVertical: 8,
      borderWidth: 4,
      borderColor: '#20232a',
      borderRadius: 6,
      backgroundColor: params.color,
      color: '#20232a',
      textAlign: 'center',
      fontSize: 30,
      fontWeight: 'bold',
    },
  }));

const App = () => {
  const { classes } = useStyles(
    { color: '#61dafb' },
    {
      styles: {
        title: {
          fontSize: 50,
        },
      },
    }
  );

  // TODO REMOVE
  console.log({
    classes,
    styles,
  });

  return (
    <View style={classes.container}>
      <Text style={classes.title}>React Native</Text>
      <StatusBar style="auto" />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#eaeaea',
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
