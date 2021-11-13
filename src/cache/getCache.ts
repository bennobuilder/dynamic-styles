import createCache, { EmotionCache, Options } from '@emotion/cache';
import { STYLE_PREFIX } from '../config';

export const { getCache } = (() => {
  let cache: EmotionCache;
  const cacheKey = STYLE_PREFIX;

  /**
   * Returns the existing cache or creates a new one
   * and returns the newly created cache
   * if no cache has been created yet.
   *
   * @param config - Configuration object
   */
  function _getCache(config?: Options) {
    if (cache == null) {
      cache = createCache(config ?? { key: cacheKey, prepend: true });
    }
    return cache;
  }

  return { getCache: _getCache };
})();
