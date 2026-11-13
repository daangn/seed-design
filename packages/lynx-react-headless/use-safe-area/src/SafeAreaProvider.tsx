import {
  createContext,
  useContext,
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
 * @internal `@seed-design/lynx-react`의 `SeedProvider`가 넣는 window 기준 inset이다.
 * LynxView가 놓인 위치와 무관하게 화면 전체에서 가려지는 양이며, `OverlaySafeAreaProvider`만 읽는다.
 */
export const WindowSafeAreaContext: Context<SafeAreaInsets | undefined> = createContext<
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

export interface OverlaySafeAreaProviderProps {
  /** 레이어를 감싼 Positioner의 `container`. 값이 무엇이든 지정되면 native `<overlay>`로 그린다. */
  container?: string | undefined;
  children?: ReactNode;
}

/**
 * @internal overlay를 그리는 Positioner가 레이어를 감싼다.
 *
 * `container`를 지정한 레이어는 LynxView 밖 window에 그려지므로, window 기준 inset이 있으면 그 값을 하위 트리의
 * safe area로 쓴다. `container`가 없거나 window 기준 inset이 없으면 가장 가까운 값을 그대로 잇는다.
 * 레이어 안에 직접 중첩한 `SafeAreaProvider`는 이 값보다 우선한다.
 */
export function OverlaySafeAreaProvider({
  container,
  children,
}: OverlaySafeAreaProviderProps): ReactElement {
  const parent = useContext(SafeAreaContext);
  const windowInsets = useContext(WindowSafeAreaContext);

  return (
    <SafeAreaContext.Provider value={container && windowInsets ? windowInsets : parent}>
      {children}
    </SafeAreaContext.Provider>
  );
}
