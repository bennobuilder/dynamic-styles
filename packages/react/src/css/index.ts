import { StyleSheet, StyleSheetConfig } from './StyleSheet';
import GlobalStyles from './GlobalStyles';
import NormalizeCSS from './NormalizeCSS';

export * from './StyleSheet';
export { GlobalStyles, NormalizeCSS };

export default StyleSheet;

/**
 * Instantiates a new `StyleSheet` instance.
 *
 * @public
 * @param config - Configuration object
 */
export function createStyleSheet<TTheme extends Record<string, any> = {}>(
  config: StyleSheetConfig<TTheme> = {}
) {
  return new StyleSheet<TTheme>(config);
}
