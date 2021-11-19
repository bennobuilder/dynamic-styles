import { createStyleSheet } from 'dynamic-styles';

export type Theme = {
  colors: {
    white: string;
    red: string;
    green: string;
    blue: string;
  };
  spacing: {
    md: number;
  };
};

export const useTheme = (): Theme => {
  return {
    colors: {
      white: '#FFFFFF',
      red: '#FF0000',
      green: '#00FF00',
      blue: '#0000FF',
    },
    spacing: {
      md: 10,
    },
  };
};

export const styleSheet = createStyleSheet({ theme: useTheme });

export default styleSheet;
