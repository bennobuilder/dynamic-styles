import { RegisteredCache, serializeStyles } from '@emotion/serialize';
import { getRegisteredStyles, insertStyles } from '@emotion/utils';
import { EmotionCache } from '@emotion/cache';
import clsx from 'clsx';
import { StyleItem } from '../createStyles';

// Inspired by
// https://emotion.sh/docs/class-names
// https://github.dev/emotion-js/emotion/blob/main/packages/react/src/class-names.js
// https://www.youtube.com/watch?v=vKJpN5FAeF4
export const { cssFactory } = (() => {
  const refPropertyName = 'ref';

  // Tries to extract the 'ref' property from the first argument of the specified args.
  // But only if just one argument is given and the given argument is of the type object.
  function extractRef(args: any[]) {
    let ref: string | null = null;

    if (args.length !== 1) {
      return { args, ref };
    }

    const [arg] = args;

    // Check if 'ref' property is included in arg
    if (!(arg instanceof Object) || !(refPropertyName in arg)) {
      return { args, ref };
    }

    // Extract and remove 'ref' property of the arg object
    ref = arg[refPropertyName];
    const argCopy = { ...arg };
    delete argCopy[refPropertyName];

    return { args: [argCopy], ref };
  }

  // Merges the specified 'classNames' into the cached class names
  // https://github.dev/emotion-js/emotion/blob/9861a18bbf4a9480fad7f21a833ddfcf814cc893/packages/react/src/class-names.js#L64
  function merge(
    registeredCache: RegisteredCache,
    classNames: string,
    css: CSSType
  ) {
    // Styles that were already registered in the cache
    const registeredStyles: string[] = [];

    // Checks which 'classNames' have already been registered in the cache
    // and adds these to the 'registeredStyles' array.
    // Unregistered 'classNames' are added to the returned 'rawClassName' string.
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
      // TODO 'ref' can only be extracted if one style item was provided
      //  and the style item is of the type object
      const { ref, args } = extractRef(styles);

      // Serialize specified styles to one 'SerializedStyle'
      const serialized = serializeStyles(args, cache.registered);

      // Insert serialized style into the emotion cache
      insertStyles(cache, serialized, false);

      return `${cache.key}-${serialized.name}${ref == null ? '' : ` ${ref}`}`;
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

export type CSSType = (styles: StyleItem[] | StyleItem) => string;
export type CXType = (...args: any) => string;
