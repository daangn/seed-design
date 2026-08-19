"use client";

import { AnimatePresence, useIsPresent, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import * as React from "react";
import styles from "./blur-swap.module.css";

const DEFAULT_BLUR = 4;
const DEFAULT_OFFSET = 8;
const DEFAULT_DURATION = 0.3;
const CONTENT_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SIZE_SPRING = { stiffness: 400, damping: 40 };

const useIsomorphicLayoutEffect =
  typeof document === "undefined" ? React.useEffect : React.useLayoutEffect;

function joinClassNames(...classNames: Array<string | false | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

interface BlurSwapLayerProps {
  blur: number;
  duration: number;
  offset: number;
  children: React.ReactNode;
}

const BlurSwapLayer = React.forwardRef<HTMLDivElement, BlurSwapLayerProps>(function BlurSwapLayer(
  { blur, duration, offset, children },
  forwardedRef,
) {
  const isPresent = useIsPresent();

  return (
    <m.div
      ref={forwardedRef}
      // 나가는 레이어는 사라지는 중일 뿐 아직 DOM에 있다. 보조기술이 두 벌을 겹쳐 읽거나
      // 포인터가 잔상을 집는 걸 막는다.
      inert={!isPresent}
      initial={{ opacity: 0, y: offset, filter: `blur(${blur}px)` }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -offset, filter: `blur(${blur}px)` }}
      transition={{ duration, ease: CONTENT_EASE }}
    >
      {children}
    </m.div>
  );
});

BlurSwapLayer.displayName = "BlurSwapLayer";

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
   * 전환 길이 (초)
   * @default 0.3
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
    duration = DEFAULT_DURATION,
    size = "auto",
    className,
    style,
  },
  forwardedRef,
) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  const contentRef = React.useRef<HTMLDivElement>(null);
  const hasMeasured = React.useRef(false);
  const [sizeApplied, setSizeApplied] = React.useState(false);

  const width = useSpring(0, SIZE_SPRING);
  const height = useSpring(0, SIZE_SPRING);

  /**
   * `activeKey`가 바뀌면 나가는 레이어는 AnimatePresence의 popLayout이 흐름 밖으로 빼내므로,
   * 이 시점의 콘텐츠 크기는 곧 들어오는 레이어의 크기다. 첫 측정만 jump로 흘려보내
   * 마운트 때 0에서 자라나지 않게 한다.
   */
  useIsomorphicLayoutEffect(() => {
    const content = contentRef.current;
    if (!content || size === "none") return;

    const sync = (animated: boolean) => {
      if (animated) {
        width.set(content.offsetWidth);
        height.set(content.offsetHeight);
        return;
      }

      width.jump(content.offsetWidth);
      height.jump(content.offsetHeight);
    };

    sync(hasMeasured.current && !prefersReducedMotion);
    hasMeasured.current = true;
    setSizeApplied(true);

    const observer = new ResizeObserver(() => sync(!prefersReducedMotion));
    observer.observe(content);

    return () => observer.disconnect();
  }, [activeKey, size, prefersReducedMotion, width, height]);

  return (
    <m.div
      ref={forwardedRef}
      className={joinClassNames(styles.root, size === "auto" && styles.inline, className)}
      style={{
        ...style,
        ...(sizeApplied && size === "auto" && { width }),
        ...(sizeApplied && size !== "none" && { height }),
      }}
    >
      <div ref={contentRef} className={size === "auto" ? styles.contentAuto : styles.content}>
        <AnimatePresence mode="popLayout" initial={false}>
          <BlurSwapLayer
            key={activeKey}
            blur={prefersReducedMotion ? 0 : blur}
            offset={prefersReducedMotion ? 0 : offset}
            duration={duration}
          >
            {children}
          </BlurSwapLayer>
        </AnimatePresence>
      </div>
    </m.div>
  );
});

BlurSwap.displayName = "BlurSwap";
