import { NativeStyleSheet, NativeStyleSheetConfig } from './NativeStyleSheet';

export * from './NativeStyleSheet';

/**
 * Instantiates a new `NativeStyleSheet` instance.
 *
 * @public
 * @param config - Configuration object
 */
export function createStyleSheet<TTheme extends Record<string, any> = {}>(
  config: NativeStyleSheetConfig<TTheme> = {}
) {
  return new NativeStyleSheet<TTheme>(config);
}
