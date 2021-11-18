import React from 'react';
import { CssFactory, CXType } from './CssFactory';
import { Interpolation, SerializedStyles } from '@emotion/react';
import { useGuaranteedMemo } from '../hooks/useGuaranteedMemo';
import createCache, { EmotionCache, Options } from '@emotion/cache';
import { CacheContext } from '../components';

export class StyleSheet<TTheme extends Record<string, unknown> = {}> {
  // Theme the Stylesheet works with
  public useTheme: () => TTheme;
  // Key/Name identifier of the StyleSheet
  public readonly key: string;
  // Emotion Cache of the StyleSheet
  public readonly cache: EmotionCache;

  /**
   * Create dynamic style sheets and link them to functional components
   * using the React hook pattern.
   *
   * @param config - Configuration object
   */
  constructor(config: StyleSheetConfig<TTheme> = {}) {
    this.key = config.key ?? 'cs';
    this.useTheme =
      typeof config.theme !== 'function'
        ? () => config.theme || {}
        : (config.theme as any);
    this.cache = createCache({
      key: this.key,
      prepend: true,
      ...(config?.cache || {}),
    });
  }

  /**
   * Indicator for the chain methods to work with `params`.
   *
   * Typescript:
   * Via this method the generic for the `params` object can be specified.
   * The `params` generic had to be excluded from the actual `create()` method
   * due to partial type inference of `TStyles`.
   * https://stackoverflow.com/questions/63678306/typescript-partial-type-inference
   *
   * @public
   */
  public withParams<
    TParams extends Record<string, unknown> = Record<string, unknown>
  >() {
    return {
      create: <TStyles extends StylesData = StylesData>(
        styles: StylesType<TParams, TStyles, TTheme, true>
      ): UseStylesType<TParams, TStyles, TTheme, true> =>
        this.createStyles<TParams, TStyles, true>(true, styles),
    };
  }

  /**
   * Indicator for the cain methods to work without `params`.
   *
   * @public
   */
  public withoutParams() {
    return {
      create: <TStyles extends StylesData = StylesData>(
        styles: StylesType<{}, TStyles, TTheme, false>
      ): UseStylesType<{}, TStyles, TTheme, false> =>
        this.createStyles<{}, TStyles, false>(false, styles),
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
  public create<
    TParams extends Record<string, unknown> = Record<string, unknown>,
    TStyles extends StylesData = StylesData
  >(styles: StylesType<TParams, TStyles, TTheme, true>) {
    return this.createStyles<TParams, TStyles, true>(true, styles);
  }

  /**
   * Internal helper to transfer the (in object shape or emotion style) specified stylesheet
   * into class names that can be accessed via the returned `useStyles()` hook.
   *
   * @internal
   * @param withParams - Whether to create the stylesheet with params (Helper property for Typescript).
   * @param styles - Stylesheet to be transferred into class names.
   */
  private createStyles<
    TParams extends Record<string, unknown> = Record<string, unknown>,
    TStyles extends StylesData = StylesData,
    TWithParams extends boolean = boolean
  >(
    withParams: TWithParams,
    styles: StylesType<TParams, TStyles, TTheme, TWithParams>
  ): UseStylesType<TParams, TStyles, TTheme, TWithParams> {
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
      const { css, cx } = this.useCss();

      let count = 0;
      // Creates a static selector that can be referenced.
      const createRef = (refName: string) => {
        count += 1;
        return `${this.key}-ref_${refName ?? 'unknown'}_${count}`;
      };

      // Assigns the specified reference ('refName') to the style instance ('style').
      const assignRef = (refName: string, style: StyleItem): string => {
        return cx(refName, css(style));
      };

      const getStylesConfig = (
        withParams
          ? { theme, params: _params, createRef, assignRef }
          : { theme, createRef, assignRef }
      ) as StylesPropsType<TParams, TTheme, TWithParams>;
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
   * React Hook that returns the memorized `cx()` and `css()` method,
   * that can be used to easily handle emotion based styles.
   *
   * @public
   */
  public useCss() {
    const cache = this.useCache();
    const cssFactory = new CssFactory(this.key);
    return useGuaranteedMemo(() => cssFactory.build(cache), [cache]);
  }

  /**
   * React Hook that returns the cache instance provided by the enclosed 'CacheProvider'
   * or an internally managed cache instance if no 'CacheProvider' could be found.
   *
   * @public
   */
  public useCache() {
    const cache = React.useContext(CacheContext);
    return cache ?? this.cache;
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
        // To have a readable 'static selector' for styling with e.g. scss, ..
        // This class name has initially no styling applied.
        // e.g. 'prefix-text-root' or 'prefix-button-container'
        name ? `${this.key}-${name}-${classKey}` : null
      );
    }

    return mergedClasses as any;
  }
}

export type StyleSheetConfig<TTheme> = {
  /**
   * Key/Name identifier of the StyleSheet
   * @default 'cs'
   */
  key?: string;
  /**
   * Options for configuring the Emotion Cache the StyleSheet relies on.
   * @default { prepend: true }
   */
  cache?: Omit<Options, 'key'>;
  /**
   * Theme the Stylesheet should work with.
   * @default undefined
   */
  theme?: TTheme | (() => TTheme);
};

export type StyleItem =
  | SerializedStyles // to do emotion based 'css' styles
  | TemplateStringsArray // to do class name based styles
  | Interpolation<any>; // to do emotion based 'object' styles

export type StylesData = Record<string, StyleItem>;

type StylesType<
  TParams extends Record<string, unknown>,
  TStyles extends StylesData,
  TTheme,
  TWithParams extends boolean
> =
  | TStyles
  | ((props: StylesPropsType<TParams, TTheme, TWithParams>) => TStyles);

type StylesPropsType<
  TParams extends Record<string, unknown>,
  TTheme,
  TWithParams extends boolean
> = TWithParams extends true
  ? BaseStylesPopsType<TParams, TTheme>
  : Omit<BaseStylesPopsType<TParams, TTheme>, 'params'>;

type BaseStylesPopsType<TParams extends Record<string, unknown>, TTheme> = {
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
  TTheme,
  TWithParams extends boolean
> = TWithParams extends true
  ? (
      params: TParams,
      config?: UseStylesConfigType<TStyles, TTheme>
    ) => UseStylesReturnType<TStyles, TTheme>
  : (
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
   * Key/Name identifier of the created style sheet.
   *
   * The here specified name is used to create a readable 'static selector'
   * for styling with e.g. scss, ..
   * This class name has initially no styling applied.
   * e.g. 'prefix-${name}-root' or 'prefix-${name}-container'
   *
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
   * Theme the created stylesheet used.
   */
  theme: TTheme;
};

export type UseStylesExtractStylesType<T> = T extends UseStylesType<
  infer TParams,
  infer TStyles,
  infer TTheme,
  infer TWithParams
>
  ? ExpandedStylesType<TStyles, TTheme>
  : never;

export type MapToX<T, X = any> = {
  [K in keyof T]: X;
};
