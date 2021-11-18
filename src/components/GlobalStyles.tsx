import React from 'react';
import * as ReactEmotion from '@emotion/react';
import { StyleItem } from '../StyleSheet';

// https://emotion.sh/docs/globals#gatsby-focus-wrapper
const GlobalStyles: React.FC<GlobalStylesProps> = (props) => {
  const { styles } = props;

  return <ReactEmotion.Global styles={ReactEmotion.css(styles)} />;
};

export default GlobalStyles;

type GlobalStylesProps = { styles: StyleItem };
