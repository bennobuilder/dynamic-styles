import React from 'react';
import { css, Interpolation, ReactNativeStyle } from '@emotion/native';

export class NativeStyleSheet<TTheme extends Record<string, any> = {}> {
  // Theme the Stylesheet works with
  public useTheme: () => TTheme;
  // Key/Name identifier of the StyleSheet
  public readonly key: string;

  /**
   * Create native dynamic style sheets and link them to functional components
   * using the React hook pattern.
   *
   * @param config - Configuration object
   */
  constructor(config: NativeStyleSheetConfig<TTheme> = {}) {
    this.key = config.key ?? 'ds'; // ds = 'dynamic styles'
    this.useTheme =
      typeof config.theme !== 'function'
        ? () => config.theme || {}
        : (config.theme as any);
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
    TParams extends Record<string, any> = Record<string, any>
  >() {
    return {
      create: <TStyles extends NativeStylesData = NativeStylesData>(
        styles: NativeStylesType<TParams, TStyles, TTheme, true>
      ): NativeUseStylesType<TParams, TStyles, TTheme, true> =>
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
      create: <TStyles extends NativeStylesData = NativeStylesData>(
        styles: NativeStylesType<{}, TStyles, TTheme, false>
      ): NativeUseStylesType<{}, TStyles, TTheme, false> =>
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
    TParams extends Record<string, any> = Record<string, any>,
    TStyles extends NativeStylesData = NativeStylesData
  >(styles: NativeStylesType<TParams, TStyles, TTheme, true>) {
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
    TParams extends Record<string, any> = Record<string, any>,
    TStyles extends NativeStylesData = NativeStylesData,
    TWithParams extends boolean = boolean
  >(
    withParams: TWithParams,
    styles: NativeStylesType<TParams, TStyles, TTheme, TWithParams>
  ): NativeUseStylesType<TParams, TStyles, TTheme, TWithParams> {
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
      ) as NativeUseStylesConfigType<TStyles, TTheme>;
      const _params = (withParams ? paramsOrConfig : undefined) as TParams;

      const styles = _config.styles ?? {};
      const name = _config.name;

      const theme = this.useTheme();

      const getStylesConfig = (
        withParams ? { theme, params: _params } : { theme }
      ) as NativeStylesPropsType<TParams, TTheme, TWithParams>;
      const _styles = getStyles(getStylesConfig);
      const _expandedStyles = (
        typeof styles === 'function' ? styles(theme) : styles
      ) as Partial<TStyles>;

      return React.useMemo(() => {
        // Transform specified 'styles' and 'expandedStyles' into ReactNative StyleSheets
        const classes: Record<string, ReactNativeStyle[]> = {};
        for (const key of Object.keys(_styles)) {
          // Add 'styles'
          classes[key] = [
            typeof _styles[key] !== 'string' // Not emotion style (`/* */`)
              ? css(_styles[key])
              : (_styles[key] as any),
          ];

          // Add 'expandedStyles'
          if (_expandedStyles[key] != null) {
            classes[key].push(
              typeof _expandedStyles[key] !== 'string' // Not emotion style (`/* */`)
                ? css(_expandedStyles[key])
                : _expandedStyles[key]
            );
          }
        }

        return {
          classes,
          theme,
        };
      }, [_styles, _expandedStyles, name]);
    };
  }
}

export type NativeStyleSheetConfig<TTheme> = {
  /**
   * Key/Name identifier of the StyleSheet
   * @default 'cs'
   */
  key?: string;
  /**
   * Theme the Stylesheet should work with.
   * @default undefined
   */
  theme?: TTheme | (() => TTheme);
};

export type NativeStyleItem =
  | TemplateStringsArray // to do emotion based styles
  | Interpolation<any>; // to do emotion based 'object' styles

export type NativeStylesData = Record<string, NativeStyleItem>;

type NativeStylesType<
  TParams extends Record<string, any>,
  TStyles extends NativeStylesData,
  TTheme,
  TWithParams extends boolean
> =
  | TStyles
  | ((props: NativeStylesPropsType<TParams, TTheme, TWithParams>) => TStyles);

type NativeStylesPropsType<
  TParams extends Record<string, any>,
  TTheme,
  TWithParams extends boolean
> = TWithParams extends true
  ? NativeBaseStylesPopsType<TParams, TTheme>
  : Omit<NativeBaseStylesPopsType<TParams, TTheme>, 'params'>;

type NativeBaseStylesPopsType<TParams extends Record<string, any>, TTheme> = {
  theme: TTheme;
  params: TParams;
};

export type NativeExpandedStylesType<
  TStyles extends NativeStylesData,
  TTheme
> =
  | Partial<MapToX<TStyles, NativeStyleItem>>
  | ((theme: TTheme) => Partial<MapToX<TStyles, NativeStyleItem>>);

export type NativeUseStylesType<
  TParams extends Record<string, any> | undefined,
  TStyles extends NativeStylesData,
  TTheme,
  TWithParams extends boolean
> = TWithParams extends true
  ? (
      params: TParams,
      config?: NativeUseStylesConfigType<TStyles, TTheme>
    ) => NativeUseStylesReturnType<TStyles, TTheme>
  : (
      config?: NativeUseStylesConfigType<TStyles, TTheme>
    ) => NativeUseStylesReturnType<TStyles, TTheme>;

type NativeUseStylesConfigType<TStyles extends NativeStylesData, TTheme> = {
  /**
   * Styles keymap to extend the styles specified in the 'createStyles()' method.
   * @default {}
   */
  styles?: NativeExpandedStylesType<TStyles, TTheme>;
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

type NativeUseStylesReturnType<TStyles extends NativeStylesData, TTheme> = {
  /**
   * Class names keymap based on the styles key map
   * specified in the 'createStyles()' method.
   */
  classes: MapToX<TStyles, ReactNativeStyle>;
  /**
   * Theme the created stylesheet used.
   */
  theme: TTheme;
};

type MapToX<T, X = any> = {
  [K in keyof T]: X;
};
