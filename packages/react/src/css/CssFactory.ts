import { EmotionCache } from '@emotion/cache';
import { RegisteredCache, serializeStyles } from '@emotion/serialize';
import { getRegisteredStyles, insertStyles } from '@emotion/utils';
import clsx from 'clsx';
import type { StyleItem } from '../StyleSheet';

// Inspired by
// https://emotion.sh/docs/class-names
// https://github.dev/emotion-js/emotion/blob/main/packages/react/src/class-names.js
export class CssFactory {
  public key: string;
  private refPropertyName = 'ref';

  /**
   *  Factory for creating emotion-based `css` utilities.
   *
   * @private
   * @param key - Key/Name identifier of the CssFactory.
   */
  constructor(key = 'unknown') {
    this.key = key;
  }

  public build(cache: EmotionCache) {
    /**
     * Converts the specified styles into a class name
     * and caches it in the emotion cache.
     *
     * @param styles - Styles to be converted into a class name
     */
    const css: CSSType = (...styles) => {
      const refs: string[] = [];
      const _styles: StyleItem[] = [];

      // Extract static selector/s ('ref' property) from style object/s
      for (const style of styles) {
        const { ref, arg } = this.extractRef(style);
        if (ref != null) refs.push(ref);
        if (arg != null) _styles.push(arg);
      }

      // Serialize specified styles to one processable 'SerializedStyle'
      const serialized = serializeStyles(_styles, cache.registered);

      // Insert serialized style into the emotion cache
      insertStyles(cache, serialized, false);

      return `${cache.key}-${serialized.name}${
        refs.length > 0 ? refs.map((ref) => ` ${ref}`) : ''
      }`;
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
    const cx: CXType = (...args) =>
      this.merge(cache.registered, clsx(args), css);

    return { css, cx };
  }

  // Merges the specified 'classNames' into the cached class names.
  // https://github.dev/emotion-js/emotion/blob/9861a18bbf4a9480fad7f21a833ddfcf814cc893/packages/react/src/class-names.js#L64
  private merge(
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

  /**
   * Tries to extract the 'ref' property from the specified argument.
   *
   * @param arg - Argument to extract the 'ref' property from.
   * @return {arg, ref} - Returns the extracted reference ('ref') and the specified argument 'arg' with the 'ref' property removed.
   */
  private extractRef(arg: any) {
    let ref: string | null = null;

    // Check if 'ref' property is included in arg instance
    if (!(arg instanceof Object) || !(this.refPropertyName in arg)) {
      return { arg, ref };
    }

    // Extract and remove 'ref' property of the arg object
    ref = arg[this.refPropertyName];
    const argCopy = { ...arg };
    delete argCopy[this.refPropertyName];

    return { arg: argCopy, ref };
  }
}

export type CSSType = (styles: StyleItem[] | StyleItem) => string;
export type CXType = (...args: any) => string;
