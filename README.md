# 🏃‍♀ Dynamic Styles

<img src="https://raw.githubusercontent.com/bennodev19/dynamic-styles/master/static/banner.png" alt="Banner">
<div>
    <i>✨ Dynamic Css-in-Js styles engine, based on <a href="https://emotion.sh/">Emotion<a/></i>
    <br>
    <br>
    <img src="https://img.shields.io/bundlephobia/minzip/dynamic-styles">
    <img src="https://img.shields.io/npm/dw/dynamic-styles">
    <img src="https://img.shields.io/npm/l/dynamic-styles">
</div>

---

Create dynamic `stylesheets` and link them to functional components using the React `hook` pattern.
- ✅ Build on top of [`@emotion/react`](https://emotion.sh/docs/@emotion/react): As fast and lightweight as emotion
- ✅ Supports all emotion features: lazy evaluation, dynamic theming, etc.
- ✅ Fully featured TypeScript support
- ✅ Server side rendering support: Next.js, Gatsby or any other environment
- ✅ `@emotion` cache support
- 🟨 Well tested (working on it)
```jsx
// Create dynamic stylesheet that has access to the previously specified theme and parameters
const useStyles = styleSheet.create(({theme, params}) => ({
    root: /* Dynamic Styles */,
    button: /* Dynamic Styles */,
    text: /* Dynamic Styles */,
}));

const MyComponent = (props) => {
    // Access dynamic styles as class names using the created 'useStyles()' hook 
    // and specify the corresponding parameters
    const { classes } = useStyles({ color: props.color, fontSize: 10 });
    
    return (
      <div className={classes.root}>
          {/* */}
      </div>
    );
}
```

### 💻 Installation

```bash
# React
$ yarn add @dyst/react @emotion/react

# React Native
$ npm install @dyst/native @emotion/react
```

### ⛳️ Code Sandbox
- [React Javascript](https://codesandbox.io/s/ds-basic-usage-js-nk55r)
- [React Typescript](https://codesandbox.io/s/ds-basic-usage-ts-b25id)
- [React-Native Javascript](https://snack.expo.dev/@bennodev/ds-basic-usage-js)

## 🪁 Basic usage

#### 📂 `./styles.js`

To create any styles, we must first instantiate a top-level `StyleSheet` instance.
This `StyleSheet` instance will be used to create dynamic and reusable stylesheets later.
In the configuration object that the `createStylesheet()` method takes up,
we can specify our application's current *theme*.
We can easily access this theme in the stylesheets we create later.
```ts
import { createStyleSheet } from '@dyst/react';

// Initialization of a StyleSheet instance called 'styleSheet'
export const styleSheet = createStyleSheet({
    theme: {
        primaryColor: "#aa11ee",
        backgroundColor: "#f3f6f4"
    }
});
```

#### 📂 `./Demo.jsx`

In our React Component (`MyComponent.jsx`) we can now use the instantiated top-level `StyleSheet` instance
to create a dynamic stylesheet for the Component.
Such a dynamic stylesheet can contain multiple styles
clustered in understandable chunks for the different parts of our Component.
For example, styles for the `root` container
and some `text` contained in the Component.
```js
import React from "react";
import { css } from "@emotion/react";
import { styleSheet } from "./styles";

// Specify dynamic styles and access them later in any React Component 
// with the returned 'useStyles()' hook.
const useStyles = styleSheet.create(
    ({theme, params}) => ({
        // Styles of the specified selectors can be created using a css object, ..
        root: {
            backgroundColor: params.color,
            "&:hover": {
                backgroundColor: theme.primaryColor,
            },
        },
        
        // .. or the common 'css()' method provided by '@emotion/react'
        text: css`
           font-weight: bold;
           font-size: ${params.fontSize}px;
           color: black;
           margin: 0;
        `
    }),
);
```
We use the `useStyles()` hook, to access the specified styles in the corresponding Component (`Demo`)
and feed it with dynamic parameters (`params`).
```jsx
const Demo = (props) => {
    const { className } = props;
    const [color, setColor] = React.useState("yellow");

    // Use the created 'useStyles()' hook to access the specified styles as class names
    // and some utility functions like 'cx()' for merging class names.
    const { classes, cx } = useStyles({ color, fontSize: 30 });

    return (
        <div className={cx(classes.root, className)}>
            <p className={classes.text}>hello world</p>
            <input value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
    );
}
```
[Live Demo](https://codesandbox.io/s/ds-basic-usage-js-nk55r)

## 🔗 Classes merging with `cx()`
> `@dyst/react`

To merge class names, we should use the `cx()` method returned by `useStyles()`.
It has the same API as the popular [clsx](https://www.npmjs.com/package/clsx) package
but is optimized for the use with `emotion`.

The key advantage of `cx()` is that it detects emotion generated class names
ensuring styles are overwritten in the correct order.
Emotion-generated styles are applied from left to right.
Subsequent styles overwrite property values of previous styles.
```jsx
import React from "react";
import { styleSheet } from "./styles";

const useStyles = styleSheet.create(({theme}) => ({
  button: {
    backgroundColor: "gray",
    border: 0,
    color: "black",
    borderRadius: 5,
    padding: "10px 20px",
    margin: 5,
    cursor: "pointer"
  },

  highlight: {
    backgroundColor: theme.primaryColor,
    color: "black",
    padding: 20
  },

  bold: {
    fontWeight: 1000,
    textDecoration: "underline"
  }  
}));

const Demo = () => {
  const [active, setActive] = React.useState(0);
  const { classes, cx } = useStyles();

  return (
    <div>
      <button
        // Merge styles (class names) using the 'cx()' method
        className={cx(classes.button, { [classes.highlight]: active === 0 })}
        onClick={() => setActive(0)}
      >
        First
      </button>
      <button
        // Merge styles (class names) using the 'cx()' method  
        className={cx(classes.button, classes.bold, { [classes.highlight]: active === 1 })}
        onClick={() => setActive(1)}
      >
        Second (Bold)
      </button>
    </div>
  );
}
```
[Live Demo](https://codesandbox.io/s/ds-class-merging-js-72de4)

## 🟦 Typescript
> `@dyst/react`, `@dyst/native`

The `dynamic-styles` API is fully type-safe.
Let's take a look at the [Basic usage](#-basic-usage) example converted to Typescript (see below).
The only part worth mentioning that has changed compared to the Javascript example
is that we put `withParams()` in front of the `create()` method.
This is necessary to tell the `create()` method the desired type (e.g. `DemoStyles`) of the `params` property.
<details>
  <summary>Why `withParams()`?</summary>

In case you are wondering why we need to go this extra step, 
and use `withParams<ParamsType>()` to specify the `params` generic.
Instead of just specifying the `generic` in the `create()` method like `create<ParamsType>()`.

Well, that's because [partial type inference](https://stackoverflow.com/questions/63678306/typescript-partial-type-inference)
is not possible in Typescript.
If we were to specify the `params` generic in the `create()` method (like `create<ParamsType>()`)
which, by the way, is possible
we would lose the type inference of the stylesheet object.
Thus, we would have to specify it manually (e.g. `create<ParamsType, StyleSheetType>()`).
```ts
import React from "react";
import { css } from "@emotion/react";
import { StyleItem } from "@dyst/react";
import { styleSheet } from "./styles";

type DemoStyles = {
    color: string;
    fontSize: number;
}

type DemoStyleSheet = {
    root: StyleItem;
    text: StyleItem;
    button: StyleItem;
}

const useStyles = styleSheet.create<DemoStyles, DemoStyleSheet>(
    ({theme, params}) => ({
        root: {
            backgroundColor: params.color,
            "&:hover": {
                backgroundColor: theme.primaryColor,
            },
        },
        text: /* More Styles */,
        button: /* More Styles */
    }),
);
```

</details>

```ts
import React from "react";
import { css } from "@emotion/react";
import { styleSheet } from "./styles";

type DemoStyles = {
  color: string;
  fontSize: number;
}

// Specify dynamic styles and access them later in any React Component 
// with the returned 'useStyles()' hook.
const useStyles = styleSheet
  .withParams<DemoStyles>() // <- CHANGE | Specify the 'params' type as generic
  .create(
    ({theme, params}) => ({
        // Styles of the specified selectors can be created using a css object, ..
        root: {
            backgroundColor: params.color,
            "&:hover": {
                backgroundColor: theme.primaryColor,
            },
        },
        
        // .. or the common 'css()' method provided by '@emotion/react'
        text: css`
           font-weight: bold;
           font-size: ${params.fontSize}px;
           color: black;
           margin: 0;
        `
    }),
);
```
In the actual Component where we include the created stylesheet with the `useStyles()` hook,
we don't need to make any adjustments to achieve full type safety.
```tsx
const Demo: React.FC<DemoProps> = (props) => {
    const { className } = props;
    const [color, setColor] = React.useState("yellow");

    // Use the created 'useStyles()' hook to access the specified styles as class names
    // and some utility functions like 'cx()' for merging class names.
    const { classes, cx } = useStyles({ color, fontSize: 30 });

    return (
        <div className={cx(classes.root, className)}>
            <p className={classes.text}>hello world</p>
            <input value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
    );
}
```
[Live Demo](https://codesandbox.io/s/ds-basic-usage-ts-b25id)

## ⚗️ Composition and nested selectors
> `@dyst/react`

To use a selector (e.g. `button` styles) in other parts of the stylesheet,
we need to create a reference to it.
This is necessary because the created `useStyles()` hook uses scoped class names
to represent the specified stylesheet.
An established reference created to a selector (e.g. `prefix-ref_button_1`), however, remains static.
In order to create such a reference, we can use the `createRef()` method,
which is given to the `create()` method.
```jsx
import React from "react";
import { styleSheet } from "./styles";

const useStyles = styleSheet.create(({theme, params, createRef, assignRef}) => {
  // Create reference for future use
  const button = createRef('button'); // Returns a static selector (e.g. 'prefix-ref_button_1')

  return {
    // Assign ref variant 1:
    button: {
      // Assign the reference to the selector via the 'ref' property
      ref: button,

      // and add any other style properties
      backgroundColor: theme.primaryColor,
      border: 0,
      color: "black",
      padding: `10px 20px`,
      borderRadius: 5,
      cursor: 'pointer',
    },
      
    // Assign ref variant 2:
    // Assign the reference to the selector via the 'assignRef()' method
    button2: assignRef(button, {
        // and add any other style properties
        backgroundColor: theme.primaryColor,
        border: 0,
        color: "black",
        padding: `10px 20px`,
        borderRadius: 5,
        cursor: 'pointer',
    }),

    container: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: theme.backgroundColor,
      padding: 50,

      // Reference button with the previously created static selector
      [`&:hover .${button}`]: {
        backgroundColor: "rred",
      },
    },
  };
});

const Demo = () => {
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
[Live Demo](https://codesandbox.io/s/ds-composition-and-nested-selectors-js-m5wcb)

## 🎥 Keyframes
> `@dyst/react`, `@dyst/native`

We can define animations using the [`keyframes`](https://emotion.sh/docs/keyframes#gatsby-focus-wrapper) helper from `@emotion/react`. 
`keyframes` takes in a *css keyframe* definition 
and returns an object we can use in the corresponding styles. 
We can use strings or objects just like `css` to create such *css keyframes*.
```jsx
import React from "react";
import { keyframes } from "@emotion/react";
import { styleSheet } from "./styles";

// Define keyframes with the 'keyframes()' method from '@emotion/react'
const bounce = keyframes`
  from, 20%, 53%, 80%, to {
    transform: translate3d(0, 0, 0);
  }

  40%, 43% {
    transform: translate3d(0, 30px, 0);
  }

  70% {
    transform: translate3d(0, 15px, 0);
  }

  90% {
    transform: translate3d(0, 4px,0);
  }
`

const useStyles = styleSheet.create({
  container: {
    textAlign: 'center',
    // Use created 'bounce' keyframes in the 'container' styles  
    animation: `${bounce} 3s ease-in-out infinite`,
  }
});

const Demo = () => {
  const { classes } = useStyles();
  return <div className={classes.container}>Keyframes demo</div>;
}
```
[Live Demo](https://codesandbox.io/s/ds-keyframes-js-vnoqw)

## 🌍 Global styles
> `@dyst/react`, `@dyst/native`

Sometimes we might want to insert `global css` styles. 
We can use the `<GlobalStyles />` component to do this.
```jsx
import React from "react";
import { GlobalStyles } from "@dyst/react";
import { useTheme } from "./useTheme";

const App = () => {
  const theme = useTheme();
    
  return (
      <>
          {/* Specify global Styles at the root of your App */}
          <GlobalStyles
              styles={{
                  '*, *::before, *::after': {
                      boxSizing: 'border-box',
                  },

                  body: {
                      backgroundColor: theme.colorScheme === 'dark' ? theme.black : theme.white,
                      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
                      lineHeight: 20,
                  },
              }}
          />

          {/* The actual App */}
          <YourApp />
      </>
  );
}
```
[Live Demo](https://codesandbox.io/s/ds-global-styles-js-sncu4)

## 🌈 `normalize.css`
> `@dyst/react`

In a web environment it is often necessary to 'normalize' the `css`,
which makes the browsers render all elements more consistently 
and in line with modern standards.
The `NormalizeCss` Component sets the normalized styles 
specified in [normalize.css](https://necolas.github.io/normalize.css/) globally.
```jsx
import { NormalizeCSS } from "@dyst/react";

const App = () => {
    return (
        <>
          <NormalizeCSS />
          <YourApp />
        </>
    );
}
```
[Live Demo](https://codesandbox.io/s/ds-normalize-css-js-fzhof)

## ✍️ Inline styles
> `@dyst/react`, `@dyst/native`

Often we need to create reusable Components
that should be customizable later on, among other things with inline styles.
We can easily make Components customizable with inline styles
by specifying the `styles` property (e.g. partial of specified stylesheet)
in the `useStyles()` hook's configuration object.

#### `./components/Button.tsx`

Here we create a reusable Button that can be styled 
via inline styles using the `styles` property.
```tsx
import React from "react";
import { UseStylesExtractStylesType } from "@dyst/react";
import { styleSheet } from "../styles";

const useStyles = styleSheet
  .withParams<ButtonStyles>()
  .create(({theme, params: { color, radius }}) => ({
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

// Create type that represents the created stylesheet type (extracted from the 'useStyles()' hook).
// This type can be used to add a typesafe 'styles' property to the Button component.
export type ExtractedStylesType = UseStylesExtractStylesType<typeof useStyles>;

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
    styles?: ExtractedStylesType; // Specify the 'styles' prop with full type safety based on the created stylesheet
    onClick: () => void;
};
```

#### `./Demo.tsx`

Use the created `Button` Component and specify `inline` styles 
with the `styles` property.
```tsx
import React from "react";
import { css } from "@emotion/react";
import { Button } from "./components/Button";

const Demo: React.FC = () => {
  const [toggled, setToggled] = React.useState(false);  
    
  return (
    <div>
        <Button
            onClick={() => setToggled(!toggled)}
            // Inline styles using the 'styles' property
            styles={{
              root: css`
                  background: ${toggled ? "green" : "gray"};
                  font-weight: bold;
                  border-radius: 50px;
              `,
            }}
        />
    </div>
  );
};
```
[Live Demo](https://codesandbox.io/s/ds-inline-styles-ts-8uuu3)

<br/>

---

# 🔨 API documentation

`coming soon`

---

<br/>

## ❓ FAQ

<details>
  <summary>Click to expand</summary>

### `React-Native StyleSheet` vs `dynamic-styles`

|                                               | `dynamic-styles` | `React-Native` Stylesheet |
|-----------------------------------------------|------------------|---------------------------|
| Compatible with `React-Native`                | ✅                | ✅                        |
| Compatible with  `React`                      | ✅                | ❌                        |
| Access global theme                           | ✅                | 🟨                        |
| Influence styles via `props` of the Component | ✅                | ❌                        |
| Styling with `JavaScript` Object              | ✅                | ✅                        |
| Styling with `Emotion` styles                 | ✅                | ❌                        |
    
### Why `dynamic-styles` and not just using [`tss-react`](https://github.com/garronej/tss-react/blob/main/README.md)?

Because `tss-react` was explicitly designed as a replacement for the `makeStyle()` API 
deprecated in Material UI 5 and thus isn't optimized for general use (without Material UI). 
Also, did it not meet all my needs, such as creating styles with the `css()` method provided by `Emotion` 
and wasn't fully typesafe.
```ts
const useStyles = styleSheet.create((theme, params) => ({
    root: css`
       // Write styles as in CSS and not in the form of an object
    `,
}));
```

</details>

## 🎉 Inspired by:

The syntax of `dynamic-styles` is inspired by the [React Native Stylesheet API](https://reactnative.dev/docs/stylesheet).
Under the hood, we have been partly inspired by [TSS-React](https://github.com/garronej/tss-react) 
and [Mantine-Styles](https://github.com/mantinedev/mantine/tree/master/src/mantine-styles).
