import { css } from '@emotion/react';
import { createStyles } from '../../../styles';

export const useStyles = createStyles<HomeStyles>()((theme, params) => ({
  root: css`
    display: flex;
    flex: 1;
    background: ${theme.colors.red};
  `,
  text: {
    fontWeight: 'bold',
    fontSize: '100px',
    color: theme.colors.green,
  },
}));

export default useStyles;

type HomeStyles = {
  toggled: boolean;
};
