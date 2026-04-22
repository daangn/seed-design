import { runOnMainThread, useEffect, useMainThreadRef } from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";
import type { RefObject } from "react";

/**
 * Lynx `<image>` 는 `<color>` 를 tint 로 blend 할 때 `tint-color` attribute 에
 * **concrete color(hex/rgb)** 만 받는다. CSS `color: var(--seed-color-...)` 를
 * slot 에 지정하면 Lynx 엔진이 var() 를 resolve 해 `getComputedStyleProperty("color")`
 * 호출 시 resolved hex 를 돌려주므로, 이 훅이 main-thread 로 건너가 그 값을 읽어
 * `setAttribute("tint-color", hex)` 로 mirror 한다.
 *
 * `depKey` 로 variant/state 가 바뀌는 시점을 알려주면 re-sync 한다.
 *
 * ```tsx
 * const { ref } = useIconColor(JSON.stringify(variantProps));
 * return cloneElement(iconChild, { ref });
 * ```
 */
export function useIconColor(depKey?: string | null): {
  ref: RefObject<MainThread.Element>;
} {
  const ref = useMainThreadRef<MainThread.Element>(null);

  useEffect(() => {
    function sync(r: RefObject<MainThread.Element>) {
      "main thread";

      const el = r.current as
        | (MainThread.Element & {
            getComputedStyleProperty?: (name: string) => string;
            getComputedCssProperty?: (name: string) => string;
          })
        | null;
      if (!el) return;

      let color: string | undefined;
      if (typeof el.getComputedStyleProperty === "function") {
        color = el.getComputedStyleProperty("color");
      } else if (typeof el.getComputedCssProperty === "function") {
        color = el.getComputedCssProperty("color");
      }

      if (color) {
        el.setAttribute("tint-color", color);
      }
    }

    runOnMainThread(sync)(ref);
  }, [depKey]);

  return { ref };
}
