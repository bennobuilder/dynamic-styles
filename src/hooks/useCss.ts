import React from 'react';
import clsx from 'clsx';
import { StyleItem } from '../createStyles';
import { serializeStyles, RegisteredCache } from '@emotion/serialize';
import { insertStyles, getRegisteredStyles } from '@emotion/utils';
import type { EmotionCache } from '@emotion/cache';
import { useCache } from './useCache';

// Inspired by
// https://emotion.sh/docs/class-names
// https://github.dev/emotion-js/emotion/blob/main/packages/react/src/class-names.js
// https://github.dev/mantinedev/mantine/blob/master/src/mantine-styles/src/tss/create-styles.ts
const { cssFactory } = (() => {
  // Merges the specified 'classNames' into the cached class names
  function merge(
    registeredCache: RegisteredCache,
    classNames: string,
    css: CSSType
  ) {
    // Styles that were already registered in the cache
    const registeredStyles: string[] = [];

    // Checks which 'classNames' have already been registered in the cache
    // and adds these to the 'registeredStyles' array.
    // Unregistered 'classNames' are added to the 'rawClassName' string.
    const rawClassName = getRegisteredStyles(
      registeredCache,
      registeredStyles, // call by reference
      classNames
    );

    if (registeredStyles.length < 2) {
      return classNames;
    }
    return rawClassName + css(registeredStyles);
  }

  function _cssFactory(cache: EmotionCache) {
    /**
     * Converts the specified styles into a class name
     * and caches it in the emotion cache.
     *
     * @param styles - Styles to be converted into a class name
     */
    const css: CSSType = (...styles) => {
      // Serialize specified styles to one 'SerializedStyle'
      const serialized = serializeStyles(styles as any, cache.registered);

      // Insert serialized style into the emotion cache
      insertStyles(cache as any, serialized, false);

      return `${cache.key}-${serialized.name}`;
    };

    /**
     * Merges the specified class names.
     *
     * It has the same api as the popular [clsx](https://www.npmjs.com/package/clsx) package.
     *
     * The key advantage of `cx` is that it detects emotion generated class names
     * ensuring styles are overwritten in the correct order.
     * Emotion generated styles are applied from left to right.
     * Subsequent styles overwrite property values of previous styles.
     *
     * More: https://emotion.sh/docs/@emotion/css#cx
     *
     * @param args - Arguments to be merged together.
     */
    const cx: CXType = (...args) => merge(cache.registered, clsx(args), css);

    return { css, cx };
  }

  return { cssFactory: _cssFactory };
})();

/**
 * Hook to retrieve a memorized `cx` and `css` method,
 * which are used to easily handle object based styles with emotion.
 */
export function useCss() {
  const cache = useCache();
  return React.useMemo(() => cssFactory(cache), [cache]);
}

export type CSSType = (styles: StyleItem[] | StyleItem) => string;
export type CXType = (...args: any) => string;
