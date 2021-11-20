import styleSheet from '../../../styles';
import { UseStylesExtractStylesType } from 'dynamic-styles';

const useStyles = styleSheet
  .withParams<ButtonStyles>()
  .create(({ theme, params: { color, radius } }) => ({
    root: {
      color: theme.colors.white,
      backgroundColor: color,
      borderRadius: radius,
      padding: theme.spacing.md,
      margin: theme.spacing.md,
      border: 0,
      cursor: 'pointer',
      height: 100,
    },
  }));

export default useStyles;

type ButtonStyles = {
  color: string;
  radius: number;
};

export type ExtractedStylesType = UseStylesExtractStylesType<typeof useStyles>;
