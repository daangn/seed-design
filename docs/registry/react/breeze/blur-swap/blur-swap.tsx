"use client";

import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { usePresence } from "@seed-design/react-presence";
import * as React from "react";
import styles from "./blur-swap.module.css";

const DEFAULT_BLUR = 4;
const DEFAULT_OFFSET = 8;
const DEFAULT_DURATION_MS = 300;

const useIsomorphicLayoutEffect =
  typeof document === "undefined" ? React.useEffect : React.useLayoutEffect;

function joinClassNames(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

interface Layer {
  key: React.Key;
  children: React.ReactNode;
}

interface BlurSwapLayerProps {
  /** React의 `key`는 prop으로 넘어오지 않으므로 나갈 때 알릴 키를 따로 받는다. */
  layerKey: React.Key;
  present: boolean;
  initial: boolean;
  onExitComplete: (key: React.Key) => void;
  children: React.ReactNode;
}

function BlurSwapLayer({
  layerKey,
  present,
  initial,
  onExitComplete,
  children,
}: BlurSwapLayerProps) {
  const { isPresent, ref } = usePresence(present);

  React.useEffect(() => {
    if (isPresent) return;

    onExitComplete(layerKey);
  }, [isPresent, layerKey, onExitComplete]);

  if (!isPresent) return null;

  return (
    <div
      ref={ref}
      className={styles.layer}
      // `usePresence`는 `animation-name`이 바뀌는 걸로 퇴장 시작을 감지한다. 그래서 상태는
      // 아직 살아 있다는 `isPresent`가 아니라, 나가라는 신호인 `present`로 그려야 한다.
      data-state={present ? "open" : "closed"}
      {...(initial && { "data-initial": "" })}
      // 나가는 레이어는 사라지는 중일 뿐 아직 DOM에 있다. 보조기술이 두 벌을 겹쳐 읽거나
      // 포인터가 잔상을 집는 걸 막는다.
      {...(!present && { inert: true })}
    >
      {children}
    </div>
  );
}

export interface BlurSwapProps {
  /**
   * 지금 보여줄 콘텐츠를 식별하는 키. 이 값이 바뀔 때 전환이 일어난다.
   */
  activeKey: React.Key;

  /**
   * `activeKey`에 해당하는 콘텐츠
   */
  children: React.ReactNode;

  /**
   * 전환 중 최대 blur 반경 (px). 0이면 blur 없이 crossfade만 한다.
   * @default 4
   */
  blur?: number;

  /**
   * 전환 중 콘텐츠가 흐르는 거리 (px). 양수면 아래에서 위로, 음수면 위에서 아래로 흐른다.
   * 0이면 제자리에서 crossfade만 한다.
   * @default 8
   */
  offset?: number;

  /**
   * 전환 길이 (ms)
   * @default 300
   */
  duration?: number;

  /**
   * 컨테이너 크기를 들어오는 콘텐츠에 맞춰 애니메이션하는 범위
   *
   * - `"auto"`: 너비와 높이 모두. 콘텐츠 너비를 그대로 쓰므로 줄바꿈이 일어나지 않는다. 라벨·뱃지처럼 한 줄짜리에 맞다.
   * - `"height"`: 높이만. 너비는 부모를 채운다. 카드·패널처럼 폭이 정해진 콘텐츠에 맞다.
   * - `"none"`: 크기를 애니메이션하지 않는다. 크기를 바깥에서 정하는 경우.
   *
   * @default "auto"
   */
  size?: "auto" | "height" | "none";

  /**
   * 추가 클래스명
   */
  className?: string;

  /**
   * 컨테이너 스타일
   */
  style?: React.CSSProperties;
}

export const BlurSwap = React.forwardRef<HTMLDivElement, BlurSwapProps>(function BlurSwap(
  {
    activeKey,
    children,
    blur = DEFAULT_BLUR,
    offset = DEFAULT_OFFSET,
    duration = DEFAULT_DURATION_MS,
    size = "auto",
    className,
    style,
  },
  forwardedRef,
) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const composedRefs = useComposedRefs(forwardedRef, rootRef);
  const contentRef = React.useRef<HTMLDivElement>(null);

  /**
   * 직전 커밋의 children. `activeKey`가 바뀐 렌더에서는 아직 갱신되기 전이라, 나가는 레이어가
   * 들고 사라져야 할 옛 내용이 여기 남아 있다.
   */
  const committedChildrenRef = React.useRef(children);

  const [stack, setStack] = React.useState(() => ({
    currentKey: activeKey,
    exiting: [] as Layer[],
    hasSwapped: false,
  }));

  // 렌더 도중 state를 맞춘다. 이 시점을 놓치면 옛 children을 붙잡을 기회가 사라진다.
  if (stack.currentKey !== activeKey) {
    setStack((previous) => ({
      currentKey: activeKey,
      exiting: [
        // 되돌아온 키는 나가는 목록에서 뺀다. 남겨두면 같은 key가 둘이 된다.
        ...previous.exiting.filter(
          (layer) => layer.key !== previous.currentKey && layer.key !== activeKey,
        ),
        { key: previous.currentKey, children: committedChildrenRef.current },
      ],
      hasSwapped: true,
    }));
  }

  useIsomorphicLayoutEffect(() => {
    committedChildrenRef.current = children;
  });

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const content = contentRef.current;
    if (!root || !content) return;

    if (size === "none") {
      root.style.width = "";
      root.style.height = "";
      return;
    }

    /**
     * 나가는 레이어는 이 시점에 이미 `position: absolute`라 흐름 밖이다. 그래서 콘텐츠 크기는
     * 곧 들어오는 레이어의 크기고, 마운트 첫 측정은 계산된 값과 같아 transition이 걸리지 않는다.
     */
    const sync = () => {
      root.style.width = size === "auto" ? `${content.offsetWidth}px` : "";
      root.style.height = `${content.offsetHeight}px`;
    };

    sync();

    const observer = new ResizeObserver(sync);
    observer.observe(content);

    return () => observer.disconnect();
  }, [activeKey, size]);

  const handleExitComplete = React.useCallback((key: React.Key) => {
    setStack((previous) => ({
      ...previous,
      exiting: previous.exiting.filter((layer) => layer.key !== key),
    }));
  }, []);

  const rootStyle: React.CSSProperties & Record<`--${string}`, string> = {
    ...style,
    "--blur-swap-blur": `${blur}px`,
    "--blur-swap-offset": `${offset}px`,
    "--blur-swap-duration": `${duration}ms`,
  };

  // 나가는 레이어와 현재 레이어가 한 배열에 있어야 자리를 옮겨도 React가 같은 인스턴스로 잇는다.
  const layers: Array<Layer & { present: boolean; initial: boolean }> = [
    ...stack.exiting.map((layer) => ({ ...layer, present: false, initial: false })),
    { key: activeKey, children, present: true, initial: !stack.hasSwapped },
  ];

  return (
    <div
      ref={composedRefs}
      className={joinClassNames(styles.root, size === "auto" && styles.inline, className)}
      style={rootStyle}
    >
      <div
        ref={contentRef}
        className={joinClassNames(styles.content, size === "auto" && styles.contentAuto)}
      >
        {layers.map((layer) => (
          <BlurSwapLayer
            key={layer.key}
            layerKey={layer.key}
            present={layer.present}
            initial={layer.initial}
            onExitComplete={handleExitComplete}
          >
            {layer.children}
          </BlurSwapLayer>
        ))}
      </div>
    </div>
  );
});

BlurSwap.displayName = "BlurSwap";
