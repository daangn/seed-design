import { useEffect, useState } from "@lynx-js/react";

/** 현재 LynxView root의 크기. 논리 px 단위다. */
export interface Viewport {
  width?: number;
  height?: number;
}

type ViewportListener = (viewport: Viewport) => void;

// root는 LynxView마다 하나이므로 측정 1회와 resize 리스너 1개를 모든 사용처가 함께 쓴다.
const listeners = new Set<ViewportListener>();
let measured: Viewport | undefined;
let stopListening: (() => void) | undefined;

/** 측정 전 값. 전체 화면이면 측정값과 같으므로 측정 뒤 레이아웃이 바뀌지 않는다. */
function getSystemViewport(): Viewport {
  if (typeof SystemInfo === "undefined" || !(SystemInfo.pixelRatio > 0)) return {};
  const toLogical = (px: number) => (px > 0 ? px / SystemInfo.pixelRatio : undefined);
  return { width: toLogical(SystemInfo.pixelWidth), height: toLogical(SystemInfo.pixelHeight) };
}

function publish(viewport: Viewport) {
  measured = viewport;
  for (const listener of listeners) listener(viewport);
}

function startListening() {
  "background only";
  const onWindowResize = (...args: unknown[]) => {
    const [width, height] = args;
    // 한 축만 오면 다른 축은 마지막 값을 유지한다.
    const previous = measured ?? getSystemViewport();
    publish({
      width: typeof width === "number" ? width : previous.width,
      height: typeof height === "number" ? height : previous.height,
    });
  };
  const emitter = lynx.getJSModule("GlobalEventEmitter");
  emitter.addListener("onWindowResize", onWindowResize);
  const stop = () => emitter.removeListener("onWindowResize", onWindowResize);
  stopListening = stop;

  // 첫 layout의 onWindowResize는 리스너 등록 전에 지나갈 수 있어 root를 한 번 측정한다.
  // ReactLynx testing library의 SelectorQuery에는 `selectRoot`가 없어, 앱 테스트가 깨지지 않도록 측정을 건너뛴다.
  const query = lynx.createSelectorQuery();
  if (typeof query.selectRoot !== "function") return;
  query
    .selectRoot()
    .invoke({
      method: "boundingClientRect",
      success: ({ width, height }: { width: number; height: number }) => {
        // 구독이 끝났거나 다시 시작된 뒤 도착한 결과는 버린다.
        if (stopListening === stop && !measured) publish({ width, height });
      },
    })
    .exec();
}

/**
 * 현재 LynxView의 크기를 반환한다. 접히는 기기, 회전, 앱 안에 삽입된 화면에서는
 * `SystemInfo`의 기기 화면 크기와 다를 수 있으므로 layout 기준으로는 이 값을 쓴다.
 *
 * 첫 렌더에는 `SystemInfo`로 계산한 기기의 논리 크기를 반환하고, root를 측정한 뒤와
 * `onWindowResize` 때 다시 렌더한다.
 */
export function useViewport(): Viewport {
  const [viewport, setViewport] = useState<Viewport>(getSystemViewport);

  useEffect(() => {
    listeners.add(setViewport);
    if (measured) setViewport(measured);
    else if (listeners.size === 1) startListening();

    return () => {
      listeners.delete(setViewport);
      if (listeners.size > 0) return;
      stopListening?.();
      stopListening = undefined;
      // 리스너가 없는 동안의 크기 변경은 놓치므로 다음 사용처가 다시 측정한다.
      measured = undefined;
    };
  }, []);

  return viewport;
}
