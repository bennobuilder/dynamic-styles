# 🖼 Create Styles
<div>
    <i>✨ Css-in-Js styles engine, based on Emotion</i>
    <br>
    <br>
    <img src="https://img.shields.io/bundlephobia/bennodev19/emotion-create-styles">
    <img src="https://img.shields.io/npm/dw/create-styles">
    <img src="https://img.shields.io/npm/l/create-styles">
</div>

- ✅ `@emotion` cache support.
- ✅ As fast and lightweight as emotion: createStyles extends [@emotion/react](https://emotion.sh/docs/@emotion/react)
- ✅ Fully featured TypeScript support

### 💻 Installation
```bash
$ yarn add create-styles
```

## ⏳ Quick Start

### 🪁 Minimal setup

`./styles.ts`

```typescript
import { makeCreateStyles } from 'create-styles';

function useTheme() {
    return {
        "primaryColor": "#32CD32",
    };
}

export const createStyles = makeCreateStyles(useTheme);
```

`./MyComponent.tsx`

```tsx
import React from 'react';
import { css } from '@emotion/react';
import { createStyles } from "./styles";

const useStyles = createStyles<{ color: "red" | "blue", fontSize: number }>()(
    (theme, { color, fontSize }) => ({
        root: {
            backgroundColor: color,
            "&:hover": {
                backgroundColor: theme.primaryColor,
            },
        },
        text: css`
           font-weight: bold;
           font-size: ${fontSize}px;
           color: black;
        `
    }),
);

export const MyComponent: React.FC = (props) => {
    const { className } = props;

    const [color, setColor] = useState<"red" | "blue">("red");

    const { classes, cx } = useStyles({ color, fontSize: 10 });

    return (
        <div className={cx(classes.root, className)}>
            <p className={classes.text}>hello world</p>
        </div>
    );
}
```

### 🎉 Inspired by:
- https://github.com/garronej/tss-react
- https://github.com/cssinjs/jss
- https://github.com/mantinedev/mantine/tree/master/src/mantine-styles
