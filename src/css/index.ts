import { StyleSheet, StyleSheetConfig } from './StyleSheet';

export * from './StyleSheet';

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
