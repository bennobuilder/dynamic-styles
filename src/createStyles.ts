import { Interpolation, SerializedStyles } from '@emotion/react';
import { useCss } from './hooks/useCss';
import { STYLE_PREFIX } from './config';
import { CXType } from './css';

/**
 * Helper method to merge the specified classes
 * with the provided styles at the corresponding key.
 *
 * @param classes - Classes key map to merge the specified 'classNames' in.
 * @param classNames - Class names key map to be merged into the specified classes.
 * @param cx - CX method
 * @param name - Key/Name identifier to be contained in each new merged class name.
 */
function mergeClassNames<T extends Record<string, string>>(
  classes: T,
  classNames: Partial<T>,
  cx: CXType,
  name?: string
): T {
  const mergedClasses: Record<string, string> = {};

  for (const classKey of Object.keys(classes)) {
    const toMergeClassName = classNames[classKey];
    mergedClasses[classKey] = cx(
      classes[classKey],
      toMergeClassName || null,
      // To have a readable 'static selector' for styling with e.g. scss.
      // This class name has initially no styling applied.
      // e.g. 'prefix-text-root' or 'prefix-button-container'
      name ? `${STYLE_PREFIX}-${name}-${classKey}` : null
    );
  }

  return mergedClasses as any;
}

export function makeCreateStyles<TTheme>(useTheme: () => TTheme) {
  // Double method ('createStyle()()') due to partial type inference of TStyles
  // https://stackoverflow.com/questions/63678306/typescript-partial-type-inference
  return <TParams extends Record<string, unknown> | undefined = undefined>() =>
    /**
     * Transfers the (in object shape or emotion style) specified styles
     * into the returned 'useStyles()' hook.
     *
     * The 'useStyles()' hook should be used in React components
     * where the styles are to be used in.
     * It provides the specified styles mapped to class names
     * and some handy utilities for working with these class names.
     *
     * @param styles - Styles to be passed to the returned 'useStyles()' hook and converted to class names.
     */ <TStyles extends StylesData = StylesData>(
      styles: StylesType<TParams, TStyles, TTheme>
    ): UseStylesType<TParams, TStyles, TTheme> => {
      const getStyles = typeof styles === 'function' ? styles : () => styles;

      /**
       * Hook for accessing the generated class names
       * based on the styles created in 'createStyles()'.
       *
       * @param params - Parameters to be passed to the style creation ('createStyles()') method.
       * @param config - Configuration object
       */
      return (params, config = {}) => {
        const styles = config.styles ?? {};
        const classNames = config.classNames ?? {};

        let count = 0;
        // Method to create a ref in 'createStyles'
        function createRef(refName: string) {
          count += 1;
          return `${STYLE_PREFIX}-ref_${refName || ''}_${count}`;
        }

        const theme = useTheme();
        const { css, cx } = useCss();
        const _styles = getStyles(theme, params, createRef);
        const _expandedStyles = (
          typeof styles === 'function' ? styles(theme) : styles
        ) as Partial<TStyles>;

        // Transform specified 'styles' into classes
        const classes: Record<string, string> = {};
        for (const key of Object.keys(_styles)) {
          classes[key] =
            typeof _styles[key] !== 'string'
              ? css(_styles[key])
              : (_styles[key] as any);
        }

        // Transform '_expandedStyles' into classes and merge them with the specified 'classNames'
        const expandedClasses: Record<string, string> = {};
        for (const key of Object.keys(_expandedStyles)) {
          expandedClasses[key] = cx(
            typeof _expandedStyles[key] !== 'string'
              ? css(_expandedStyles[key])
              : _expandedStyles[key],
            classNames
          );
        }

        return {
          classes: mergeClassNames<MapToX<TStyles, string>>(
            classes as any,
            expandedClasses as any,
            cx,
            config.name
          ),
          cx,
          theme,
        };
      };
    };
}

export type StyleItem =
  | SerializedStyles // to do emotion based 'css' styles
  | TemplateStringsArray // to do class name based styles
  | Interpolation<any>; // to do emotion based 'object' styles

export type StylesData = Record<string, StyleItem>;

type StylesType<
  TParams extends Record<string, unknown> | undefined,
  TStyles extends StylesData,
  TTheme
> =
  | TStyles
  | ((
      theme: TTheme,
      params: TParams,
      createRef: (refName: string) => string
    ) => TStyles);

export type ExtendedStylesType<TStyles extends StylesData, TTheme> =
  | Partial<MapToX<TStyles, StyleItem>>
  | ((theme: TTheme) => Partial<MapToX<TStyles, StyleItem>>);

type UseStylesConfigType<TStyles extends StylesData, TTheme> = {
  /**
   * Styles keymap to extend the styles specified in the 'createStyles()' method.
   * @default {}
   */
  styles?: ExtendedStylesType<TStyles, TTheme>;
  /**
   * ClassNames keymap to extend the styles specified in the 'createStyles()' method.
   *
   * ClassNames can also specified in the 'styles' property,
   * however in case we need additional styles (e.g. that depend on a local property)
   * beside the className styles this property exists.
   * @default {}
   */
  classNames?: Partial<Record<string, string>>;
  /**
   * Key/Name identifier of the created styles.
   * @default 'unknown'
   */
  name?: string;
};

type UseStylesReturnType<TStyles extends StylesData, TTheme> = {
  /**
   * Merges the specified class names.
   *
   * It has the same api as the popular [clsx](https://www.npmjs.com/package/clsx) package.
   *
   * The key advantage of `cx` is that it detects emotion generated class names
   * ensuring styles are overwritten in the correct order.
   * Emotion generated styles are applied from left to right.
   * Subsequent styles overwrite property values of previous styles.
   *
   * More: https://emotion.sh/docs/@emotion/css#cx
   *
   * @param args - Arguments to be merged together.
   */
  cx: CXType;
  /**
   * Class names keymap based on the styles key map
   * specified in the 'createStyles()' method.
   */
  classes: MapToX<TStyles, string>;
  /**
   * Theme
   */
  theme: TTheme;
};

export type UseStylesType<
  TParams extends Record<string, unknown> | undefined,
  TStyles extends StylesData,
  TTheme,
  TConfig extends UseStylesConfigType<TStyles, TTheme> = UseStylesConfigType<
    TStyles,
    TTheme
  >
> = (params: TParams, config?: TConfig) => UseStylesReturnType<TStyles, TTheme>;

export type ExtractStylesType<T> = T extends UseStylesType<
  infer TParams,
  infer TStyles,
  infer TTheme,
  infer TConfig
>
  ? TConfig['styles']
  : never;

export type MapToX<T, X = any> = {
  [K in keyof T]: X;
};
