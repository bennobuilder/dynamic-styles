import { useCache } from './useCache';
import { useGuaranteedMemo } from './useGuaranteedMemo';
import { cssFactory } from '../css';

/**
 * Hook to retrieve a memorized `cx` and `css` method,
 * that can be used to easily handle styles based on emotion.
 */
export function useCss() {
  const cache = useCache();
  return useGuaranteedMemo(() => cssFactory(cache), [cache]);
}
