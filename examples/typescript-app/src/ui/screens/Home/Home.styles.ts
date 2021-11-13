import { css } from '@emotion/react';
import { createStyles } from '../../../theme';

export const useStyles = createStyles<HomeStyles>()((theme, params) => ({
  root: css`
    display: flex;
    height: 100vh;
    flex-direction: column;
    background: ${params.toggled ? theme.colors.white : theme.colors.red};
    align-items: center;
    justify-content: center;
  `,
  text: {
    fontWeight: 'bold',
    fontSize: '100px',
    color: params.toggled ? 'black' : theme.colors.green,
  },
}));

export default useStyles;

type HomeStyles = {
  toggled: boolean;
};
