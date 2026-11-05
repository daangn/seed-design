/**
 * main-thread 버전 이벤트를 자동으로 생성하는 타입
 *
 * @example
 * ```typescript
 * type Props = WithMainThread<{
 *   bindtap?: () => void;
 * }>;
 *
 * // 결과:
 * // {
 * //   bindtap?: () => void;
 * //   "main-thread:bindtap"?: () => void;
 * // }
 * ```
 */
export type WithMainThread<T> = T & {
  [K in keyof T as `main-thread:${string & K}`]?: T[K];
};
