import { StyleSheet, StyleSheetConfig } from './StyleSheet';

export * from './css';
export * from './cache';
export * from './StyleSheet';

// Reexport from @emotion/react
export { keyframes } from '@emotion/react';

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

export default StyleSheet;
