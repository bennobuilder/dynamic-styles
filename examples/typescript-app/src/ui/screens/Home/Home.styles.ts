import { css, keyframes } from '@emotion/react';
import { styleSheet } from '../../../theme';

const bounce = keyframes`
  from, 20%, 53%, 80%, to {
    transform: translate3d(0,0,0);
  }

  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }

  70% {
    transform: translate3d(0, -15px, 0);
  }

  90% {
    transform: translate3d(0,-4px,0);
  }
`;

export const useStyles = styleSheet
  .withParams<HomeStyles>()
  .create(({ theme, params, createRef, assignRef }) => {
    // create reference
    const text = createRef('text');

    return {
      root: css`
        display: flex;
        height: 50vh;
        flex-direction: column;
        background: ${params.toggled ? theme.colors.white : theme.colors.red};
        align-items: center;
        justify-content: center;
        border: solid 1px black;

        :hover .${text} {
          text-decoration: underline;
          background: rebeccapurple;
        }
      `,
      // text: {
      //   // assign reference to selector
      //   ref: text,
      //
      //   // and add any other properties
      //   fontWeight: 'bold',
      //   fontSize: '100px',
      //   color: params.toggled ? 'black' : theme.colors.green,
      // },
      // or
      text: assignRef(text, {
        fontWeight: 'bold',
        fontSize: '100px',
        color: params.toggled ? 'black' : theme.colors.green,
      }),
      bounce: css`
        animation: ${bounce} 1s ease infinite;
      `,
    };
  });

export default useStyles;

type HomeStyles = {
  toggled: boolean;
};
