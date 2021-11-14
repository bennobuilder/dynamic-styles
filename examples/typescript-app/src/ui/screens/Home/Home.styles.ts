import { css } from '@emotion/react';
import { createStyles } from '../../../theme';
import { keyframes } from 'create-styles';

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
  rotate: {
    '& g': {
      opacity: 0,
      animation: `${keyframes`
            60%, 100% {
                opacity: 0;
            }
            0% {
                opacity: 0;
            }
            40% {
                opacity: 1;
            }
            `} 3.5s infinite ease-in-out`,
    },
  },
}));

export default useStyles;

type HomeStyles = {
  toggled: boolean;
};
