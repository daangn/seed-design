import {
  createContext,
  useContext,
  useMemo,
  type ReactElement,
  type ReactNode,
} from "@lynx-js/react";
import {
  PreferredMotionContext,
  type PreferredMotion,
} from "@seed-design/lynx-react-scale-feedback";
import {
  SafeAreaContext,
  useStableSafeAreaInsets,
  type SafeAreaInsets,
} from "@seed-design/lynx-react-use-safe-area";

import { readDeprecatedGlobalProp } from "../utils/deprecated-global-props";
import { useHostGlobalProps } from "../utils/use-host-global-props";

/** 호스트 앱이 SEED에 넘기는 값. 모든 필드는 선택이며 논리 px 단위다. */
export interface SeedContextValue {
  /**
   * 호스트가 선호하는 색상 스킴. root `colorMode`가 `"system"`일 때 적용할 테마를 정한다.
   * root `colorMode`를 적용한 결과가 아니라 호스트 설정값이다.
   */
  preferredColorScheme?: "light" | "dark";
  /** 호스트가 선호하는 모션 강도. `"reduced"`이면 Scale Feedback 등 장식용 모션을 끈다. */
  preferredMotion?: PreferredMotion;
  /** 하위 트리의 safe area inset. 생략하면 `useSafeArea`가 기존 fallback 경로를 쓴다. */
  safeAreaInsets?: SafeAreaInsets;
}

type SeedHostValue = Omit<SeedContextValue, "safeAreaInsets">;

const SeedContext = createContext<SeedHostValue>({});

export interface SeedProviderProps extends SeedContextValue {
  children?: ReactNode;
}

/**
 * 호스트 앱의 값을 SEED 컴포넌트에 전달한다. 앱 root에 하나 둔다.
 *
 * 어떤 global props 키를 읽을지는 앱이 정하고, SEED는 여기 넘긴 값만 쓴다.
 * 생략한 필드는 바깥 `SeedProvider`의 값을 이어받는다.
 *
 * @example
 * ```tsx
 * function Root() {
 *   // 기본 `globalPropsMode: "reactive"`는 host 값이 바뀌면 전체를 다시 렌더하므로 바로 읽는다.
 *   // `"event"`이면 `useGlobalProps()`로 읽는다.
 *   const g = lynx.__globalProps as HostGlobalProps;
 *   return (
 *     <SeedProvider
 *       preferredColorScheme={g.theme === "dark" ? "dark" : "light"}
 *       preferredMotion={g.motion === "reduced" ? "reduced" : "default"}
 *       safeAreaInsets={toSafeAreaInsets(g)}
 *     >
 *       <Page />
 *     </SeedProvider>
 *   );
 * }
 * ```
 */
export function SeedProvider({
  preferredColorScheme,
  preferredMotion,
  safeAreaInsets,
  children,
}: SeedProviderProps): ReactElement {
  const parent = useContext(SeedContext);
  const parentSafeAreaInsets = useContext(SafeAreaContext);
  const stableSafeAreaInsets = useStableSafeAreaInsets(safeAreaInsets);

  const resolvedColorScheme = preferredColorScheme ?? parent.preferredColorScheme;
  const resolvedMotion = preferredMotion ?? parent.preferredMotion;
  const value = useMemo<SeedHostValue>(
    () => ({ preferredColorScheme: resolvedColorScheme, preferredMotion: resolvedMotion }),
    [resolvedColorScheme, resolvedMotion],
  );

  // safe area와 motion의 원천은 하위 패키지 context다. 값을 생략하면 바깥 값을 그대로 이어 트리 모양을 유지한다.
  return (
    <SeedContext.Provider value={value}>
      <PreferredMotionContext.Provider value={resolvedMotion}>
        <SafeAreaContext.Provider value={stableSafeAreaInsets ?? parentSafeAreaInsets}>
          {children}
        </SafeAreaContext.Provider>
      </PreferredMotionContext.Provider>
    </SeedContext.Provider>
  );
}

function toColorScheme(value: unknown): "light" | "dark" | undefined {
  if (typeof value !== "string") return undefined;
  return value.toLowerCase() === "dark" ? "dark" : "light";
}

function toMotion(value: unknown): PreferredMotion | undefined {
  if (value === undefined) return undefined;
  return value === "reduced" ? "reduced" : "default";
}

/**
 * `SeedProvider`가 받은 값을 그대로 돌려준다. 파생 계산은 하지 않는다.
 *
 * Provider가 없거나 필드를 생략하면, 다음 메이저 전까지 기존 global props(`theme`, `motion`)로
 * 그 필드를 채운다(deprecated). `safeAreaInsets`는 global props로 채우지 않는다.
 */
export function useSeedContext(): SeedContextValue {
  const host = useContext(SeedContext);
  const safeAreaInsets = useContext(SafeAreaContext);
  // deprecated fallback도 host 값 변경에 반응하도록 `globalPropsMode`에 맞게 읽는다.
  const globalProps = useHostGlobalProps();

  const preferredColorScheme =
    host.preferredColorScheme ?? toColorScheme(readDeprecatedGlobalProp(globalProps, "theme"));
  const preferredMotion =
    host.preferredMotion ?? toMotion(readDeprecatedGlobalProp(globalProps, "motion"));

  return useMemo(
    () => ({ preferredColorScheme, preferredMotion, safeAreaInsets }),
    [preferredColorScheme, preferredMotion, safeAreaInsets],
  );
}
