# 🖼 Create Styles

<img src="https://raw.githubusercontent.com/bennodev19/emotion-create-styles/develop/static/banner.png" alt="Banner">
<div>
    <i>✨ Css-in-Js styles engine, based on Emotion</i>
    <br>
    <br>
    <img src="https://img.shields.io/bundlephobia/bennodev19/emotion-create-styles">
    <img src="https://img.shields.io/npm/dw/create-styles">
    <img src="https://img.shields.io/npm/l/create-styles">
</div>

<br>

Link a style sheet with a function component using the hook pattern.
```ts
const useStyles = createStyles()((theme, params) => ({
    root: /* */,
    container: /* */,
    text: /* */,
}))
```

- ✅ Fully featured TypeScript support
- ✅ Build on top of [`@emotion/react`](https://emotion.sh/docs/@emotion/react): As fast and lightweight as emotion
- ✅ Supports all emotion features: lazy evaluation, dynamic theming, etc.
- ✅ Server side rendering support: Next.js, Gatsby or any other environment
- ✅ `@emotion` cache support

### 💻 Installation

```bash
$ yarn add create-styles @emotion/react
# or
$ npm install create-styles @emotion/react
```

### ⛳️ Code Sandbox
- [Basic example](https://codesandbox.io/s/emotion-create-styles-byu6s?file=/src/theme.ts)
- (more coming soon)

### 🟨 Javascript support
Although `create-styles` has been designed with Typescript in mind it can of course be used in any vanilla JS projects.

# ⏳ Quick Start

## 🪁 Basic usage

`./styles.ts`
```ts
import { makeCreateStyles } from 'create-styles';

// Theme hook that should return the current theme of the App. 
// This theme will then be used in the created 'createStyles()' method.
function useTheme(): Theme {
    return {
        "primaryColor": "#32CD32",
    };
}

// Initialization of the 'createStyles()' method with the theme hook,
// which exposes the apps theme to the 'createStyles()' method.
export const createStyles = makeCreateStyles(useTheme);
```

`./MyComponent.tsx`
```tsx
import React from 'react';
import { css } from '@emotion/react';
import { createStyles } from "./styles";

type MyComponentStyles = { color: "red" | "blue", fontSize: number }

// Specify styles and use them later with the returned 'useStyles()' hook
// (Note: Double method ('createStyle()()') due to partial type inference of TStyles)
const useStyles = createStyles<MyComponentStyles>()(
    (theme, params) => ({
        // The styles of the specified classes can be created with a css object 
        root: {
            backgroundColor: params.color,
            "&:hover": {
                backgroundColor: theme.primaryColor,
            },
        },
        // or with the common 'css()' method of '@emotion/react'
        text: css`
           font-weight: bold;
           font-size: ${params.fontSize}px;
           color: black;
        `
    }),
);

export const Demo: React.FC = (props) => {
    const { className } = props;
    const [color, setColor] = useState<"red" | "blue">("red");

    // Use the created 'useStyles()' hook to access the specified styles
    // and some utilities like 'cx()'
    const { classes, cx } = useStyles({ color, fontSize: 10 });

    return (
        <div className={cx(classes.root, className)}>
            <p className={classes.text}>hello world</p>
        </div>
    );
}
```

## 🔗 Classes merging (`cx()` function)

To merge class names use the `cx()` function.
It has the same api as [clsx](https://www.npmjs.com/package/clsx) package.

The key advantage of `cx` is that it detects emotion generated class names
ensuring styles are overwritten in the correct order.
Emotion generated styles are applied from left to right.
Subsequent styles overwrite property values of previous styles.
```tsx
import React from 'react';
import { createStyles } from "./styles";

const useStyles = createStyles((theme) => ({
  button: {
    backgroundColor: theme.colors.darkBlue,
    border: 0,
    color: theme.colors.white,
    borderRadius: 5,
    padding: '10px 20px',
    cursor: 'pointer',
  },

  active: {
    backgroundColor: theme.colors.lightBlue,
    color: theme.colors.black,
  },
    
  bold: {
    fontWeight: 'bold',
  }  
}));

const Demo: React.FC = () => {
  const [active, setActive] = useState(0);
  const { classes, cx } = useStyles();

  return (
    <div>
      <button
        // Merge classes with the 'cx()' method
        className={cx(classes.button, { [classes.active]: active === 0 })}
        onClick={() => setActive(0)}
        type="button"
      >
        First
      </button>
      <button
        // Merge classes with the 'cx()' method  
        className={cx(classes.button, classes.bold, { [classes.active]: active === 1 })}
        onClick={() => setActive(1)}
        type="button"
      >
        Second (Bold)
      </button>
    </div>
  );
}
```

## 🖌 Composition and nested selectors
todo

## 🎞 Keyframes
todo

## 🌍 Global styles

Sometimes you might want to insert global css. You can use the <GlobalStyles /> component to do this.
```tsx
import { GlobalStyles } from 'create-styles';

export function App() {
  return (
      <>
          <GlobalStyles
              styles={{
                  '*, *::before, *::after': {
                      boxSizing: 'border-box',
                  },

                  body: {
                      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark : theme.white,
                      color: theme.colorScheme === 'dark' ? theme.colors.dark : theme.black,
                      lineHeight: 20,
                  },
              }}
          />
          <YourApp />
      </>
  );
}
```

## 🎎 `normalize.css`

The NormalizeCss component sets the normalized styles specified in [normalize.css](https://necolas.github.io/normalize.css/) globally.
```tsx
import {NormalizeCSS} from 'create-styles';

function App() {
    return (
        <>
          <NormalizeCSS />
          <YourApp />
        </>
    );
}
```

# 🔨 API documentation
todo


### 🎉 Inspired by:
- https://github.com/garronej/tss-react
- https://github.com/cssinjs/jss
- https://github.com/mantinedev/mantine/tree/master/src/mantine-styles
