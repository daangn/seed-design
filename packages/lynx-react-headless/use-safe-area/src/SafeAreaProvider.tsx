import {
  createContext,
  useMemo,
  type Context,
  type ReactElement,
  type ReactNode,
} from "@lynx-js/react";

/** 논리 px 단위의 safe area inset. */
export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * @internal `SafeAreaProvider`와 `@seed-design/lynx-react`의 `SeedProvider`가 공유하는 원천이다.
 * 앱은 `SafeAreaProvider`나 `SeedProvider`로 값을 넣는다.
 */
export const SafeAreaContext: Context<SafeAreaInsets | undefined> = createContext<
  SafeAreaInsets | undefined
>(undefined);

/**
 * @internal 앱이 렌더마다 새 객체 literal을 넘겨도 값이 같으면 같은 객체를 돌려줘
 * context 구독자가 다시 그려지지 않게 한다.
 */
export function useStableSafeAreaInsets<T extends SafeAreaInsets | undefined>(insets: T): T {
  const { top, right, bottom, left } = insets ?? {};

  return useMemo(() => insets, [insets === undefined, top, right, bottom, left]);
}

export interface SafeAreaProviderProps {
  /** 호스트가 알려 준 safe area inset. 4방향 모두 논리 px로 넘긴다. `0`도 유효한 값이다. */
  insets: SafeAreaInsets;
  children?: ReactNode;
}

/**
 * 하위 트리의 safe area inset을 지정한다.
 *
 * 같은 Lynx View의 `<overlay>` 콘텐츠처럼 영역마다 다른 inset이 필요하면 그 영역 안에 다시 중첩한다.
 * 앱 root에서는 보통 `@seed-design/lynx-react`의 `SeedProvider`에 `safeAreaInsets`를 넘긴다.
 */
export function SafeAreaProvider({ insets, children }: SafeAreaProviderProps): ReactElement {
  const value = useStableSafeAreaInsets(insets);

  return <SafeAreaContext.Provider value={value}>{children}</SafeAreaContext.Provider>;
}
