# 🏃‍♀ Dynamic Styles [`@ds/react`]

<img src="https://raw.githubusercontent.com/bennodev19/dynamic-styles/master/static/banner.png" alt="Banner">
<div>
    <i>✨ Dynamic Css-in-Js styles engine, based on <a href="https://emotion.sh/">Emotion<a/></i>
    <br>
    <br>
    <img src="https://img.shields.io/bundlephobia/minzip/@ds/react">
    <img src="https://img.shields.io/npm/dw/@ds/react">
    <img src="https://img.shields.io/npm/l/@ds/react">
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
$ yarn add @ds/react @emotion/react @emotion/native
# or
$ npm install @ds/react @emotion/react @emotion/native
```

### ⛳️ Code Sandbox
- [React Javascript](https://codesandbox.io/s/ds-basic-usage-js-nk55r)
- [React Typescript](https://codesandbox.io/s/ds-basic-usage-ts-b25id)

## 🪁 Basic usage

Learn more [here](https://github.com/bennodev19/dynamic-styles#-basic-usage)
