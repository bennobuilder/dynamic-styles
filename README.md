# 🖼 Create Styles

<img src="https://raw.githubusercontent.com/bennodev19/emotion-create-styles/develop/static/banner.png" alt="Banner">
<div>
    <i>✨ Css-in-Js styles engine, based on <a href="https://emotion.sh/">Emotion<a/></i>
    <br>
    <br>
    <img src="https://img.shields.io/bundlephobia/minzip/create-styles">
    <img src="https://img.shields.io/npm/dw/create-styles">
    <img src="https://img.shields.io/npm/l/create-styles">
</div>

---

Create dynamic stylesheets and link them to functional components using the React `hook` pattern.
- ✅ Build on top of [`@emotion/react`](https://emotion.sh/docs/@emotion/react): As fast and lightweight as emotion
- ✅ Supports all emotion features: lazy evaluation, dynamic theming, etc.
- ✅ Fully featured TypeScript support
- ✅ Server side rendering support: Next.js, Gatsby or any other environment
- ✅ `@emotion` cache support
```tsx
const useStyles = styleSheet.create(({theme, params}) => ({
    root: /* Styles */,
    container: /* Styles */,
    text: /* Styles */,
}));

const MyComponent = () => {
    const { classes } = useStyles({ color: 'red', fontSize: 10 });
    return (
    <div className={classes.root}>
        {/* */}
    </div>
);
}
```

### 💻 Installation

```bash
$ yarn add create-styles @emotion/react
# or
$ npm install create-styles @emotion/react
```

### ⛳️ Code Sandbox
- [Basic example](https://codesandbox.io/s/emotion-create-styles-byu6s?file=/src/theme.ts)
- (more coming soon)

<br/>

## 🪁 Basic usage

### 📂 `./styles.js`

To create any styles, we must first instantiate a top-level `StyleSheet` instance.
The `StyleSheet` instance will be used to create dynamic and reusable stylesheets.
In the configuration object that the `createStylesheet()` method takes up,
we can specify among others the current *theme* of our application,
so that we can easily access it in the stylesheets we create later.
```ts
import { createStylesheet } from 'create-styles';

// Initialization of a StyleSheet instance called 'styleSheet'
export const styleSheet = createStylesheet({
    theme: {
       primaryColor: "#32CD32",
    }
});
```

### 📂 `./MyComponent.jsx`

In our React Component (`MyComponent.jsx`) we can now use the instantiated top-level `StyleSheet` instance
to create a dynamic stylesheet for it.
Such dynamic stylesheet can contain multiple styles
clustered in understandable chunks for the different parts of our Component.
For examples, styles for the `root` container of the Component 
and some `text` component.
```ts
import React from 'react';
import {css} from '@emotion/react';
import styleSheet from "./styles";

// Specify dynamic styles and access them later in any React Component 
// using the returned 'useStyles()' hook.
const useStyles = styleSheet.create(
    ({theme, params}) => ({
        // Styles of the specified classes can be created using a css object, ..
        root: {
            backgroundColor: params.color,
            "&:hover": {
                backgroundColor: theme.primaryColor,
            },
        },
        // .. or the common 'css()' method of '@emotion/react'
        text: css`
           font-weight: bold;
           font-size: ${params.fontSize}px;
           color: black;
        `
    }),
);
```
We use the `useStyles()` hook, to access the specified styles 
and feed them with the corresponding dynamic parameters (`params`).
```tsx
export const Demo: React.FC = (props) => {
    const { className } = props;
    const [color, setColor] = useState("red");

    // Use the created 'useStyles()' hook to access the specified styles as classes
    // and some utility functions like 'cx()' for merging class names.
    const { classes, cx } = useStyles({ color, fontSize: 10 });

    return (
        <div className={cx(classes.root, className)}>
            <p className={classes.text}>hello world</p>
        </div>
    );
}
```

## 🔗 Classes merging with `cx()`

To merge class names, you should use the `cx()` method returned by `useStyles()`.
It has the same API as the popular [clsx](https://www.npmjs.com/package/clsx) package
but is optimized for the use with `emotion`.

The key advantage of `cx()` is that it detects emotion generated class names
ensuring styles are overwritten in the correct order.
Emotion generated styles are applied from left to right.
Subsequent styles overwrite property values of previous styles.
```tsx
import React from 'react';
import { styleSheet } from "./styles";

const useStyles = styleSheet.create(({theme}) => ({
  button: {
    backgroundColor: theme.colors.darkBlue,
    border: 0,
    color: theme.colors.white,
    borderRadius: 5,
    padding: '10px 20px',
    cursor: 'pointer',
  },

  highlight: {
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
        // Merge styles (class names) with the 'cx()' method
        className={cx(classes.button, { [classes.highlight]: active === 0 })}
        onClick={() => setActive(0)}
        type="button"
      >
        First
      </button>
      <button
        // Merge styles (class names) with the 'cx()' method  
        className={cx(classes.button, classes.bold, { [classes.highlight]: active === 1 })}
        onClick={() => setActive(1)}
        type="button"
      >
        Second (Bold)
      </button>
    </div>
  );
}
```

## 🟦 Typescript

todo

## ⚗️ Composition and nested selectors

Since `createStyles()` generates scoped class names based on the specified stylesheet,
you have to create a reference to the selector (e.g. 'button') to get the static selector (e.g. 'prefix-ref_button_1').
The `createStyles()` method receives the `createRef()` method to handle the creation of static selectors.
```tsx
import React from 'react';
import { createStyles } from "./styles";

const useStyles = createStyles()(({theme, params, createRef, assignRef}) => {
  // Create reference for future use
  const button = createRef('button'); // Returns a static selector (e.g. 'prefix-ref_button_1')

  return {
    // Assign ref variant 1:
    button: {
      // Assign the reference to the selector via the 'ref' property
      ref: button,

      // and add any other style properties
      backgroundColor: theme.colors.blue,
      color: theme.colors.white,
      padding: `10px 20px`,
      borderRadius: 5,
      cursor: 'pointer',
    },
      
    // Assign ref variant 2:
    // Assign the reference to the selector via the 'assignRef()' method
    button2: assignRef(button, {
        // and add any other style properties
        backgroundColor: theme.colors.blue,
        color: theme.colors.white,
        padding: `10px 20px`,
        borderRadius: 5,
        cursor: 'pointer',
    }),

    container: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: theme.colors.white,
      padding: 10,

      // Reference button with the previously created static selector
      [`&:hover .${button}`]: {
        backgroundColor: theme.colors.violet[6],
      },
    },
  };
});

const Demo: React.FC = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.container}>
      <button className={classes.button} type="button">
        Hover container to change button color
      </button>
    </div>
  );
}
```

## 🎥 Keyframes

You can define animations using the [`keyframes`](https://emotion.sh/docs/keyframes#gatsby-focus-wrapper) helper from `@emotion/react`. 
`keyframes` takes in a css keyframe definition and returns an object you can use in styles. 
You can use strings or objects just like `css`.
```tsx
import React from 'react';
import { keyframes } from '@emotion/react';
import { createStyles } from "./styles";

// Create keyframes with the 'keyframes()' method
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
`

const useStyles = createStyles()(({theme}) => ({
  container: {
    textAlign: 'center',
    // Use specified 'bounce' keyframes in the 'container' styles  
    animation: `${bounce} 3s ease-in-out infinite`,
  },
}));

const Demo: React.FC = () => {
  const { classes } = useStyles();
  return <div className={classes.container}>Keyframes demo</div>;
}
```

## 🌍 Global styles

Sometimes you might want to insert `global css` styles. You can use the <GlobalStyles /> component to do this.
```tsx
import React from 'react';
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

## 🌈 `normalize.css`

The `NormalizeCss` component sets the normalized styles specified in [normalize.css](https://necolas.github.io/normalize.css/) globally.
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

## ✍️ Inline styles

If you plan to style reusable components with the `createStyles()` API, 
you may want to customize the components later with, for example, inline styles.
You can easily achieve this specifying the `styles` property (e.g. partial of specified stylesheet) 
in the `useStyles()` hook's configuration object. 

### `Button.tsx`

Create `Button` component.
```tsx
import React from 'react';
import { createStyles } from "./styles";

const useStyles = createStyles<ButtonStyles>()(({theme, params: { color, radius }}) => ({
    root: {
        color: theme.colors.white,
        backgroundColor: color,
        borderRadius: radius,
        padding: '10px 20px',
        cursor: 'pointer',
    },
}));

type ButtonStyles = {
    color: string;
    radius: number;
};

// Create a type that represents the created stylesheet type (extracted from the 'useStyles()' hook).
// Can then be used to add a typesafe styles property to the Button component.
export type ExtractedStylesType = ExtractStylesType<typeof useStyles>;

export const Button: React.FC<ButtonProps> = (props) => {
  const { color = 'blue', radius = 0, styles = {}, onClick } = props;
  // Pass the 'styles' property to the 'useStyles()' hook
  const { classes } = useStyles({ color, radius }, { styles, name: 'Button' });

  return (
    <button type="button" className={classes.root} onClick={onClick}>
      {color} button with {radius}px radius
    </button>
  );
};

type ButtonProps = {
  color?: string;
  radius?: number;
  styles?: ExtractedStylesType; // Complete typesafety based on the created stylesheet
  onClick: () => void;
};
```

### `./MyComponent.tsx`

Use the created `Button` component and specify `inline` styles 
using the `styles` property.
```tsx
import React from 'react';
import { css } from '@emotion/react';
import { Button } from './Button';

const MyComponent: React.FC = () => {
  return (
    <div>
        <Button
            onClick={() => setToggled(!toggled)}
            // Inline styles using the 'styles' property
            styles={{
              root: css`
                  background: rebeccapurple;
              `,
            }}
        />
    </div>
  );
};
```

<br/>

---

# 🔨 API documentation

`coming soon`

---

<br/>

## ❓ FAQ

<details>
  <summary>Click to expand</summary>
    
### Why `create-styles` and not just using [`tss-react`](https://github.com/garronej/tss-react/blob/main/README.md)?
Because `tss-react` was explicitly designed as a replacement for the `makeStyle` API 
deprecated in Material UI 5 and thus isn't optimized for the general use (without Material UI). 
Also, did it not meet all my needs, such as creating styles with the `css()` method provided by `Emotion` 
and wasn't fully typesafe.
```ts
const useStyles = createStyles()((theme, params) => ({
    root: css`
       // Write styles as in CSS and not in the form of an object
    `,
}));
```
    
</details>

## 🎉 Inspired by:

- https://github.com/garronej/tss-react
- https://github.com/mantinedev/mantine/tree/master/src/mantine-styles
