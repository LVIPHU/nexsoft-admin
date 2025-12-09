import { useEffect, useLayoutEffect } from 'react';

/**
 * Custom hook that uses either `useLayoutEffect` or `useEffect` based on the environment (client-side or server-side).
 * @param {Function} effect - The effect function to be executed.
 * @param {Array<any>} [dependencies] - An array of dependencies for the effect (optional).
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-isomorphic-layout-effect)
 * @example
 * ```tsx
 * use-isomorphic-layout-effect(() => {
 *   // Code to be executed during the layout phase on the client side
 * }, [dependency1, dependency2]);
 * ```
 */

const IS_SERVER = typeof window === 'undefined';

export const useIsomorphicLayoutEffect = IS_SERVER ? useEffect : useLayoutEffect;
