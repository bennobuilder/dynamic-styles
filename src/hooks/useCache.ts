import React from 'react';
import { cacheContext, getCache } from '../cache';

/**
 * Returns the cache instance provided by a wrapped 'CacheProvider'
 * or the internally managed cache instance if no 'CacheProvider' could be found.
 */
export function useCache() {
  const cache = React.useContext(cacheContext);
  return cache ?? getCache();
}
