import React from 'react';
import { CXType } from './css';
import { STYLE_PREFIX } from './config';
import { Interpolation, SerializedStyles } from '@emotion/react';
import { useCss } from './hooks/useCss';

export class StyleSheet<TTheme extends Record<string, unknown> = {}> {
  // Theme the Stylesheet works with
  public useTheme: () => TTheme;

  /**
   * todo
   *
   * @param theme - Theme by the Stylesheet.
   */
  constructor(theme?: TTheme | (() => TTheme)) {
    this.useTheme =
      typeof theme !== 'function' ? () => theme || {} : (theme as any);
  }

  /**
   * Specifies Params for the `create()` styles method.
   *
   * This had to be excluded from the actual `create()` method
   * due to partial type inference of `TStyles`.
   * https://stackoverflow.com/questions/63678306/typescript-partial-type-inference
   */
  public withParams<
    TParams extends Record<string, unknown> | undefined = undefined
  >() {
    return {
      /**
       * Transfers the (in object shape or emotion style) specified stylesheet
       * into class names that can be accessed via the returned `useStyles` hook.
       *
       * The returned `useStyles()` hook should be used in React components
       * to access the generated style class names and other utilities
       * for working with emotion-based class names.
       *
       * @public
       * @param styles - Stylesheet to be transferred into class names.
       */
      create: <TStyles extends StylesData = StylesData>(
        styles: StylesType<TParams, TStyles, TTheme>
      ): UseStylesType<TParams, TStyles, TTheme> =>
        this.createStyle<TParams, TStyles>(styles, true),
    };
  }

  /**
   * Transfers the (in object shape or emotion style) specified stylesheet
   * into class names that can be accessed via the returned `useStyles()` hook.
   *
   * The returned `useStyles()` hook should be used in React components
   * to access the generated style class names and other utilities
   * for working with emotion-based class names.
   *
   * @public
   * @param styles - Stylesheet to be transferred into class names.
   */
  public create<TStyles extends StylesData = StylesData>(
    styles: StylesType<undefined, TStyles, TTheme>
  ) {
    return this.createStyle<undefined, TStyles>(styles, false);
  }

  /**
   * Internal helper to transfer the (in object shape or emotion style) specified stylesheet
   * into class names that can be accessed via the returned `useStyles()` hook.
   *
   * @internal
   * @param styles - Stylesheet to be transferred into class names.
   * @param withParams - Whether to create the stylesheet with params.
   */
  private createStyle<
    TParams extends Record<string, unknown> | undefined = undefined,
    TStyles extends StylesData = StylesData
  >(
    styles: StylesType<TParams, TStyles, TTheme>,
    withParams = false
  ): UseStylesType<TParams, TStyles, TTheme> {
    const getStyles = typeof styles === 'function' ? styles : () => styles;

    /**
     * Hook for accessing the generated class names
     * based on the styles created in 'createStyles()'.
     *
     * @param params - Parameters to be passed to the style creation ('createStyles()') method.
     * @param config - Configuration object
     */
    return (paramsOrConfig = {}, config = {}) => {
      const _config = (
        withParams ? config : paramsOrConfig
      ) as UseStylesConfigType<TStyles, TTheme>;
      const _params = (withParams ? paramsOrConfig : undefined) as TParams;

      const styles = _config.styles ?? {};
      const classNames = _config.classNames ?? {};
      const name = _config.name;

      const theme = this.useTheme();
      const { css, cx } = useCss();

      let count = 0;
      // Creates a static selector that can be referenced.
      function createRef(refName: string) {
        count += 1;
        return `${STYLE_PREFIX}-ref_${refName ?? 'unknown'}_${count}`;
      }

      // Assigns the specified reference ('refName') to the style instance ('style').
      function assignRef(refName: string, style: StyleItem): string {
        return cx(refName, css(style));
      }

      const getStylesConfig = (
        withParams
          ? { theme, params: _params, createRef, assignRef }
          : { theme, createRef, assignRef }
      ) as StylesPropsType<TParams, TTheme>;
      const _styles = getStyles(getStylesConfig);
      const _expandedStyles = (
        typeof styles === 'function' ? styles(theme) : styles
      ) as Partial<TStyles>;

      return React.useMemo(() => {
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
          classes: this.mergeClassNames<MapToX<TStyles, string>>(
            classes as any,
            expandedClasses as any,
            cx,
            name
          ),
          cx,
          theme,
        };
      }, [_styles, _expandedStyles, classNames, name]);
    };
  }

  /**
   * Merges the specified class names
   * with the expanding class names at the corresponding key.
   *
   * @internal
   * @param classNames - Class names key map to merge the expanding class names in.
   * @param expandingClassNames - Expanding class names key map to be merged into the specified class names.
   * @param cx - CX method for merging.
   * @param name - Key/Name identifier to be contained in each merged class name.
   */
  private mergeClassNames<T extends Record<string, string>>(
    classNames: T,
    expandingClassNames: Partial<T>,
    cx: CXType,
    name?: string
  ): T {
    const mergedClasses: Record<string, string> = {};

    for (const classKey of Object.keys(classNames)) {
      const toMergeClassName = expandingClassNames[classKey];
      mergedClasses[classKey] = cx(
        classNames[classKey],
        toMergeClassName || null,
        // To have a readable 'static selector' for styling with e.g. scss.
        // This class name has initially no styling applied.
        // e.g. 'prefix-text-root' or 'prefix-button-container'
        name ? `${STYLE_PREFIX}-${name}-${classKey}` : null
      );
    }

    return mergedClasses as any;
  }
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
> = TStyles | ((props: StylesPropsType<TParams, TTheme>) => TStyles);

type StylesPropsType<
  TParams extends Record<string, unknown> | undefined,
  TTheme
> = TParams extends undefined
  ? Omit<BaseStylesPopsType<TParams, TTheme>, 'params'>
  : BaseStylesPopsType<TParams, TTheme>;

type BaseStylesPopsType<
  TParams extends Record<string, unknown> | undefined,
  TTheme
> = {
  theme: TTheme;
  params: TParams;
  createRef: (refName: string) => string;
  assignRef: (refName: string, style: StyleItem) => string;
};

export type ExpandedStylesType<TStyles extends StylesData, TTheme> =
  | Partial<MapToX<TStyles, StyleItem>>
  | ((theme: TTheme) => Partial<MapToX<TStyles, StyleItem>>);

export type UseStylesType<
  TParams extends Record<string, unknown> | undefined,
  TStyles extends StylesData,
  TTheme
> = TParams extends undefined
  ? (
      config?: UseStylesConfigType<TStyles, TTheme>
    ) => UseStylesReturnType<TStyles, TTheme>
  : (
      params: TParams,
      config?: UseStylesConfigType<TStyles, TTheme>
    ) => UseStylesReturnType<TStyles, TTheme>;

type UseStylesConfigType<TStyles extends StylesData, TTheme> = {
  /**
   * Styles keymap to extend the styles specified in the 'createStyles()' method.
   * @default {}
   */
  styles?: ExpandedStylesType<TStyles, TTheme>;
  /**
   * ClassNames keymap to extend the styles specified in the 'createStyles()' method.
   *
   * ClassNames can also specified in the 'styles' property,
   * however in case we need additional styles (e.g. that depend on a local property)
   * beside the className styles this property exists.
   * @default {}
   */
  classNames?: Partial<MapToX<TStyles, string>>;
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

export type UseStylesExtractStylesType<T> = T extends UseStylesType<
  infer TParams,
  infer TStyles,
  infer TTheme
>
  ? ExpandedStylesType<TStyles, TTheme>
  : never;

export type MapToX<T, X = any> = {
  [K in keyof T]: X;
};

// TYPE TEST GROUND | TODO REMOVE ----------------------------------------------------------

const myStyleSheet = new StyleSheet();
const useStyles = myStyleSheet.create(({ theme }) => ({
  container: {},
  text: {},
}));
const { classes, theme } = useStyles();

const myStyleSheet2 = new StyleSheet({ color: 'red' });
const useStyles2 = myStyleSheet2
  .withParams<{ clicked: boolean }>()
  .create(({ params }) => ({
    container: {},
    text: {},
  }));
const { classes: classes2, theme: theme2 } = useStyles2({ clicked: true });

// TYPE TEST GROUND | TODO REMOVE ----------------------------------------------------------
