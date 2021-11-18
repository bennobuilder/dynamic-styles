import { StyleSheet, StyleSheetConfig } from './StyleSheet';

export * from './StyleSheet';

export default StyleSheet;

/**
 * todo
 *
 * @public
 * @param config - Configuration object
 */
export function createStyleSheet<TTheme extends Record<string, unknown> = {}>(
  config: StyleSheetConfig<TTheme> = {}
) {
  return new StyleSheet<TTheme>(config);
}
