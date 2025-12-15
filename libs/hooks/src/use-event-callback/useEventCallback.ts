import { useCallback, useRef } from 'react'

import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect'

/**
 * Custom hook that creates a memoized event callback.
 * @template Args - An array of argument types for the event callback.
 * @template R - The return type of the event callback.
 * @param {(...args: Args) => R} fn - The callback function.
 * @returns {(...args: Args) => R} A memoized event callback function.
 * @public
 * @see [Documentation](https://usehooks-ts.com/react-hook/use-event-callback)
 * @example
 * ```tsx
 * const handleClick = useEventCallback((event) => {
 *   // Handle the event here
 * });
 * ```
 */
export function useEventCallback<TArgs extends Array<unknown>, TReturn>(
  fn: (...args: TArgs) => TReturn,
): (...args: TArgs) => TReturn
export function useEventCallback<TArgs extends Array<unknown>, TReturn>(
  fn: ((...args: TArgs) => TReturn) | undefined,
): ((...args: TArgs) => TReturn) | undefined
export function useEventCallback<TArgs extends Array<unknown>, TReturn>(
  fn: ((...args: TArgs) => TReturn) | undefined,
): ((...args: TArgs) => TReturn) | undefined {
  const ref = useRef<typeof fn>(() => {
    throw new Error('Cannot call an event handler while rendering.')
  })

  useIsomorphicLayoutEffect(() => {
    ref.current = fn
  }, [fn])

  return useCallback((...args: TArgs) => ref.current?.(...args), [ref]) as (
    ...args: TArgs
  ) => TReturn
}
