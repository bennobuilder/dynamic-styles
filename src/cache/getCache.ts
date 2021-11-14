import createCache, { EmotionCache, Options } from '@emotion/cache';
import { STYLE_PREFIX } from '../config';

export const { getCache } = (() => {
  let cache: EmotionCache | null = null;
  const cacheKey = STYLE_PREFIX;

  /**
   * Returns the existing cache or creates a new one
   * and returns the newly created cache
   * if no cache has been created yet.
   *
   * @param config - Configuration object
   */
  function _getCache(config: GetCacheConfig = {}) {
    const { reset, ...cacheOptions } = config;
    if (cache == null || reset) {
      const finalCacheOptions = {
        key: cacheKey,
        prepend: true,
        ...cacheOptions,
      };
      cache = createCache(finalCacheOptions);
    }
    return cache;
  }

  return { getCache: _getCache };
})();

type GetCacheConfig = Partial<Options> & {
  reset?: boolean;
};
