import React from 'react';
import useStyles, { ExtractedStylesType } from './Button.styles';
import { useTheme } from '../../../theme';

const Button: React.FC<ButtonProps> = (props) => {
  const theme = useTheme();
  const { color = theme.colors.red, radius = 0, styles = {}, onClick } = props;
  const { classes } = useStyles({ color, radius }, { styles, name: 'Button' });

  return (
    <button type="button" className={classes.button} onClick={onClick}>
      {color} button with {radius}px radius
    </button>
  );
};

export default Button;

type ButtonProps = {
  color?: string;
  radius?: number;
  styles?: ExtractedStylesType;
  onClick: () => void;
};
