import { makeCreateStyles } from 'create-styles';

type Theme = {
  colors: {
    red: string;
    green: string;
    blue: string;
  };
};

const useTheme = (): Theme => {
  return {
    colors: {
      red: '#FF0000',
      green: '#00FF00',
      blue: '#0000FF',
    },
  };
};

export const createStyles = makeCreateStyles(useTheme);

export default createStyles;
