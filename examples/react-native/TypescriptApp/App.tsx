import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styleSheet from './src/styles';
import { css } from '@emotion/native';
import { getRandomColor } from './src/utils';

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
  const [color, setColor] = React.useState('#61dafb');
  const { styles } = useStyles(
    { color: color },
    {
      styles: {
        title: {
          fontSize: 50,
        },
      },
    }
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setColor(getRandomColor())}>
        <Text style={styles.title}>React Native</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
};

export default App;
