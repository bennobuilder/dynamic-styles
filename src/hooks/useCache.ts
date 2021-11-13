import React from 'react';
import { CacheContext, getCache } from '../cache';

/**
 * Returns the cache instance provided by a wrapped 'CacheProvider'
 * or the internally managed cache instance if no 'CacheProvider' could be found.
 */
export function useCache() {
  const cache = React.useContext(CacheContext);
  return cache ?? getCache();
}
