import { createContext, type Context } from "@lynx-js/react";

/** 호스트가 선호하는 모션 강도. `"reduced"`이면 Scale Feedback을 끈다. */
export type PreferredMotion = "default" | "reduced";

/**
 * @internal `@seed-design/lynx-react`의 `SeedProvider`가 `preferredMotion`을 넣는 context다.
 * 앱은 `SeedProvider`로 값을 넘긴다.
 */
export const PreferredMotionContext: Context<PreferredMotion | undefined> = createContext<
  PreferredMotion | undefined
>(undefined);
