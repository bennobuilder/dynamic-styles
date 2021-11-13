// https://babeljs.io/docs/en/config-files#config-function-api
export default function getBabelConfig() {
  return {
    ignore: ['./node_modules'],
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            // Only targeting browsers supporting ES Modules (https://babeljs.io/docs/en/babel-preset-env)
            // Why?: https://github.com/babel/babel/issues/9849#issuecomment-592668815
            esmodules: true,
          },
        },
      ],
    ],
  };
}
