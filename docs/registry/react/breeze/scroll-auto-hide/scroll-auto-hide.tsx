"use client";

import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { Slot } from "@radix-ui/react-slot";
import { vars } from "@seed-design/css/vars";
import * as React from "react";
import styles from "./scroll-auto-hide.module.css";

const SNAP_DURATION_MS = 200;
const SNAP_THRESHOLD_RATIO = 0.5;
const SCROLL_SETTLE_DELAY_MS = 120;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type ScrollTimelineConstructor = new (options: {
  source: Element;
  axis: "block";
}) => AnimationTimeline;

type ScrollAutoHideOwnProps = {
  /** 스크롤을 감지할 컨테이너의 ref */
  scrollContainerRef: React.RefObject<HTMLElement | null>;
};

type ScrollAutoHideAsChildProps = ScrollAutoHideOwnProps &
  Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
    asChild: true;
    children: React.ReactElement;
  };

type ScrollAutoHideDefaultProps = ScrollAutoHideOwnProps &
  React.HTMLAttributes<HTMLDivElement> & {
    asChild?: false;
  };

export type ScrollAutoHideProps = ScrollAutoHideAsChildProps | ScrollAutoHideDefaultProps;

const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", "End", "Home", "PageDown", "PageUp", " "]);

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function parseTranslateY(value: string) {
  if (!value || value === "none") return 0;

  const values = value.slice(value.indexOf("(") + 1, -1).split(/[ ,]+/);
  const yIndex = value.startsWith("matrix3d(") ? 13 : value.startsWith("matrix(") ? 5 : 1;
  const y = Number.parseFloat(values[yIndex] ?? "0");
  return Number.isFinite(y) ? y : 0;
}

function hasTransitionDuration(value: string) {
  return value.split(",").some((duration) => Number.parseFloat(duration) > 0);
}

export const ScrollAutoHide = React.forwardRef<HTMLElement, ScrollAutoHideProps>(
  function ScrollAutoHide({ asChild, scrollContainerRef, className, ...props }, forwardedRef) {
    const rootRef = React.useRef<HTMLElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, rootRef);

    React.useEffect(() => {
      const root = rootRef.current;
      const scrollContainer = scrollContainerRef.current;
      if (!root || !scrollContainer) return;

      const initialTransform = root.style.transform;
      const initialTransition = root.style.transition;
      const initialWillChange = root.style.willChange;
      const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
      const supportsScrollEnd = typeof scrollContainer.onscrollend !== "undefined";
      const ScrollTimeline = Reflect.get(window, "ScrollTimeline") as unknown;
      let scrollTimeline: AnimationTimeline | undefined;

      if (typeof ScrollTimeline === "function") {
        try {
          scrollTimeline = new (ScrollTimeline as ScrollTimelineConstructor)({
            source: scrollContainer,
            axis: "block",
          });
        } catch {
          scrollTimeline = undefined;
        }
      }

      const getScrollTop = () => {
        const maxScrollTop = Math.max(
          0,
          scrollContainer.scrollHeight - scrollContainer.clientHeight,
        );
        return Math.min(maxScrollTop, Math.max(0, scrollContainer.scrollTop));
      };

      let height = 0;
      let naturalOffset = 0;
      let translateY = 0;
      let previousScrollTop = getScrollTop();
      let isSettling = false;
      let isTouching = false;
      let trackingAnimation: Animation | undefined;
      let trackingDirection = 0;
      let settleTimer: ReturnType<typeof setTimeout> | undefined;
      let settleTransition = initialTransition;
      let skipNextSettleAnimation = false;

      const clamp = (value: number, min: number) => Math.min(0, Math.max(min, value));

      const computeMinTranslate = (scrollTop: number) => {
        if (height === 0 || scrollTop <= naturalOffset) return 0;
        if (scrollTop >= naturalOffset + height) return -height;
        return -(scrollTop - naturalOffset);
      };

      const applyTranslate = (value: number) => {
        translateY = value;
        root.style.transform = `translate3d(0px, ${value}px, 0px)`;
      };

      const stopTracking = () => {
        trackingAnimation?.cancel();
        trackingAnimation = undefined;
        trackingDirection = 0;
      };

      const syncTracking = () => {
        if (!trackingAnimation) return;

        const renderedTranslateY = parseTranslateY(getComputedStyle(root).transform);
        stopTracking();
        applyTranslate(clamp(renderedTranslateY, computeMinTranslate(getScrollTop())));
      };

      const startTracking = (direction: number, scrollTop: number) => {
        if (!scrollTimeline || direction === 0 || direction === trackingDirection) return;

        stopTracking();

        const maxScrollTop = Math.max(
          0,
          scrollContainer.scrollHeight - scrollContainer.clientHeight,
        );
        if (maxScrollTop === 0) return;

        let rangeStart: number;
        let rangeEnd: number;
        let rangeStartTranslate: number;
        let rangeEndTranslate: number;

        if (direction > 0) {
          rangeStart = translateY === 0 ? Math.max(scrollTop, naturalOffset) : scrollTop;
          rangeEnd = Math.min(maxScrollTop, rangeStart + translateY + height);
          rangeStartTranslate = translateY;
          rangeEndTranslate = translateY - (rangeEnd - rangeStart);
        } else {
          rangeEnd = scrollTop;
          rangeStart = Math.max(0, rangeEnd + translateY);
          rangeStartTranslate = Math.min(0, translateY + rangeEnd - rangeStart);
          rangeEndTranslate = translateY;
        }

        if (rangeStart === rangeEnd) {
          applyTranslate(translateY);
          return;
        }

        const startOffset = rangeStart / maxScrollTop;
        const endOffset = rangeEnd / maxScrollTop;
        const startTransform = `translate3d(0px, ${rangeStartTranslate}px, 0px)`;
        const endTransform = `translate3d(0px, ${rangeEndTranslate}px, 0px)`;

        applyTranslate(translateY);
        try {
          trackingAnimation = root.animate(
            [
              { transform: startTransform, offset: 0 },
              { transform: startTransform, offset: startOffset },
              { transform: endTransform, offset: endOffset },
              { transform: endTransform, offset: 1 },
            ],
            { fill: "both", timeline: scrollTimeline },
          );
        } catch {
          scrollTimeline = undefined;
          applyTranslate(translateY);
          return;
        }
        trackingDirection = direction;
      };

      const clearSettleTimer = () => {
        if (settleTimer === undefined) return;
        clearTimeout(settleTimer);
        settleTimer = undefined;
      };

      const finishSettling = () => {
        if (isSettling) {
          isSettling = false;
          root.style.transition = settleTransition;
        }
        root.style.willChange = initialWillChange;
      };

      const cancelSettling = () => {
        if (!isSettling) return;
        const renderedTranslateY = parseTranslateY(getComputedStyle(root).transform);
        finishSettling();
        applyTranslate(clamp(renderedTranslateY, computeMinTranslate(getScrollTop())));
      };

      const settle = () => {
        clearSettleTimer();
        syncTracking();
        if (height === 0) return;

        if (mediaQuery.matches) {
          finishSettling();
          root.style.transition = initialTransition;
          applyTranslate(0);
          skipNextSettleAnimation = false;
          return;
        }

        const visibleRatio = 1 + translateY / height;
        const minTranslate = computeMinTranslate(getScrollTop());
        const target = visibleRatio >= SNAP_THRESHOLD_RATIO ? 0 : clamp(-height, minTranslate);

        if (target === translateY) {
          finishSettling();
          skipNextSettleAnimation = false;
          return;
        }

        if (skipNextSettleAnimation) {
          finishSettling();
          root.style.transition = initialTransition;
          applyTranslate(target);
          skipNextSettleAnimation = false;
          return;
        }

        if (!isSettling) settleTransition = root.style.transition;
        const computedStyle = getComputedStyle(root);
        const computedTransition = computedStyle.transition;
        const translateTransition = `transform ${SNAP_DURATION_MS}ms ${vars.$timingFunction.enter}`;

        isSettling = true;
        root.style.willChange = "transform";
        root.style.transition = hasTransitionDuration(computedStyle.transitionDuration)
          ? `${computedTransition}, ${translateTransition}`
          : translateTransition;
        applyTranslate(target);
      };

      const scheduleSettle = () => {
        if (supportsScrollEnd || isTouching) return;
        clearSettleTimer();
        settleTimer = setTimeout(settle, SCROLL_SETTLE_DELAY_MS);
      };

      const measure = () => {
        syncTracking();
        cancelSettling();

        const previousPosition = root.style.position;
        const previousTransition = root.style.transition;
        const previousTransform = root.style.transform;
        const visibleRatio = height === 0 ? 1 : 1 + translateY / height;

        root.style.position = "relative";
        root.style.transition = "none";
        root.style.transform = "none";

        const rootRect = root.getBoundingClientRect();
        const scrollRect = scrollContainer.getBoundingClientRect();
        const scrollTop = getScrollTop();
        height = rootRect.height;
        naturalOffset = scrollTop + rootRect.top - scrollRect.top - scrollContainer.clientTop;

        root.style.position = previousPosition;
        root.style.transition = previousTransition;
        root.style.transform = previousTransform;

        const nextTranslate = height === 0 ? 0 : -(1 - visibleRatio) * height;
        applyTranslate(clamp(nextTranslate, computeMinTranslate(scrollTop)));
      };

      const handleScroll = () => {
        clearSettleTimer();
        cancelSettling();

        const scrollTop = getScrollTop();
        const scrollDelta = scrollTop - previousScrollTop;
        previousScrollTop = scrollTop;

        if (mediaQuery.matches) {
          stopTracking();
          finishSettling();
          applyTranslate(0);
          return;
        }

        root.style.willChange = "transform";
        translateY = clamp(translateY - scrollDelta, computeMinTranslate(scrollTop));

        if (scrollTimeline && !skipNextSettleAnimation) {
          startTracking(Math.sign(scrollDelta), scrollTop);
        } else {
          stopTracking();
          applyTranslate(translateY);
        }
        scheduleSettle();
      };

      const handleInteractionStart = () => {
        clearSettleTimer();
        cancelSettling();
        syncTracking();
        skipNextSettleAnimation = false;
      };

      const handleTouchStart = () => {
        isTouching = true;
        handleInteractionStart();
      };

      const handleTouchEnd = () => {
        isTouching = false;
        if (!supportsScrollEnd) scheduleSettle();
      };

      const handleFocusIn = () => {
        clearSettleTimer();
        cancelSettling();
        stopTracking();
        previousScrollTop = getScrollTop();
        root.style.transition = initialTransition;
        root.style.willChange = initialWillChange;
        applyTranslate(0);
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (!SCROLL_KEYS.has(event.key)) return;
        if (!(event.target instanceof Node) || !scrollContainer.contains(event.target)) return;
        if (
          event.target instanceof HTMLElement &&
          (event.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName))
        ) {
          return;
        }
        skipNextSettleAnimation = true;
        cancelSettling();
        syncTracking();
      };

      const handleTransitionComplete = (event: TransitionEvent) => {
        if (event.target !== root || event.propertyName !== "transform") return;
        finishSettling();
      };

      const handleReducedMotionChange = () => {
        clearSettleTimer();
        cancelSettling();
        stopTracking();
        finishSettling();
        root.style.transition = initialTransition;
        applyTranslate(0);
        previousScrollTop = getScrollTop();
        skipNextSettleAnimation = false;

        if (!mediaQuery.matches) measure();
      };

      measure();

      const resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(root);
      resizeObserver.observe(scrollContainer);

      scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
      scrollContainer.addEventListener("scrollend", settle);
      scrollContainer.addEventListener("touchstart", handleTouchStart, { passive: true });
      scrollContainer.addEventListener("touchend", handleTouchEnd, { passive: true });
      scrollContainer.addEventListener("touchcancel", handleTouchEnd, { passive: true });
      scrollContainer.addEventListener("wheel", handleInteractionStart, { passive: true });
      root.addEventListener("focusin", handleFocusIn);
      root.addEventListener("transitionend", handleTransitionComplete);
      root.addEventListener("transitioncancel", handleTransitionComplete);
      root.ownerDocument.addEventListener("keydown", handleKeyDown);
      mediaQuery.addEventListener("change", handleReducedMotionChange);

      return () => {
        clearSettleTimer();
        stopTracking();
        resizeObserver.disconnect();
        scrollContainer.removeEventListener("scroll", handleScroll);
        scrollContainer.removeEventListener("scrollend", settle);
        scrollContainer.removeEventListener("touchstart", handleTouchStart);
        scrollContainer.removeEventListener("touchend", handleTouchEnd);
        scrollContainer.removeEventListener("touchcancel", handleTouchEnd);
        scrollContainer.removeEventListener("wheel", handleInteractionStart);
        root.removeEventListener("focusin", handleFocusIn);
        root.removeEventListener("transitionend", handleTransitionComplete);
        root.removeEventListener("transitioncancel", handleTransitionComplete);
        root.ownerDocument.removeEventListener("keydown", handleKeyDown);
        mediaQuery.removeEventListener("change", handleReducedMotionChange);
        root.style.transform = initialTransform;
        root.style.transition = initialTransition;
        root.style.willChange = initialWillChange;
      };
    }, [scrollContainerRef]);

    const Component = asChild ? Slot : "div";

    return (
      <Component {...props} ref={composedRefs} className={joinClassNames(styles.root, className)} />
    );
  },
);

ScrollAutoHide.displayName = "ScrollAutoHide";
