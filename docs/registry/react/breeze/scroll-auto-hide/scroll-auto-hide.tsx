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

  const parts = value.split(" ");
  const y = Number.parseFloat(parts[1] ?? parts[0]);
  return Number.isFinite(y) ? y : 0;
}

export const ScrollAutoHide = React.forwardRef<HTMLElement, ScrollAutoHideProps>(
  function ScrollAutoHide({ asChild, scrollContainerRef, className, ...props }, forwardedRef) {
    const rootRef = React.useRef<HTMLElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, rootRef);

    React.useEffect(() => {
      const root = rootRef.current;
      const scrollContainer = scrollContainerRef.current;
      if (!root || !scrollContainer) return;

      const initialTranslate = root.style.translate;
      const initialTransition = root.style.transition;
      const initialWillChange = root.style.willChange;
      const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
      const supportsScrollEnd = typeof scrollContainer.onscrollend !== "undefined";

      let height = 0;
      let naturalOffset = 0;
      let translateY = 0;
      let previousScrollTop = scrollContainer.scrollTop;
      let isSettling = false;
      let isTouching = false;
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
        root.style.translate = `0px ${value}px`;
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
        const renderedTranslateY = parseTranslateY(getComputedStyle(root).translate);
        finishSettling();
        applyTranslate(clamp(renderedTranslateY, computeMinTranslate(scrollContainer.scrollTop)));
      };

      const settle = () => {
        clearSettleTimer();
        if (height === 0) return;

        const visibleRatio = 1 + translateY / height;
        const minTranslate = computeMinTranslate(scrollContainer.scrollTop);
        const target = visibleRatio >= SNAP_THRESHOLD_RATIO ? 0 : clamp(-height, minTranslate);

        if (target === translateY) {
          finishSettling();
          skipNextSettleAnimation = false;
          return;
        }

        if (mediaQuery.matches || skipNextSettleAnimation) {
          finishSettling();
          root.style.transition = initialTransition;
          applyTranslate(target);
          skipNextSettleAnimation = false;
          return;
        }

        settleTransition = root.style.transition;
        const computedTransition = getComputedStyle(root).transition;
        const translateTransition = `translate ${SNAP_DURATION_MS}ms ${vars.$timingFunction.enter}`;

        isSettling = true;
        root.style.willChange = "translate";
        root.style.transition =
          computedTransition && computedTransition !== "all 0s ease 0s"
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
        cancelSettling();

        const previousPosition = root.style.position;
        const previousTransition = root.style.transition;
        const previousTranslate = root.style.translate;
        const visibleRatio = height === 0 ? 1 : 1 + translateY / height;

        root.style.position = "relative";
        root.style.transition = "none";
        root.style.translate = "none";

        const rootRect = root.getBoundingClientRect();
        const scrollRect = scrollContainer.getBoundingClientRect();
        height = rootRect.height;
        naturalOffset =
          scrollContainer.scrollTop + rootRect.top - scrollRect.top - scrollContainer.clientTop;

        root.style.position = previousPosition;
        root.style.transition = previousTransition;
        root.style.translate = previousTranslate;

        const nextTranslate = height === 0 ? 0 : -(1 - visibleRatio) * height;
        applyTranslate(clamp(nextTranslate, computeMinTranslate(scrollContainer.scrollTop)));
      };

      const handleScroll = () => {
        clearSettleTimer();
        cancelSettling();
        root.style.willChange = "translate";

        const scrollTop = scrollContainer.scrollTop;
        const scrollDelta = scrollTop - previousScrollTop;
        previousScrollTop = scrollTop;
        applyTranslate(
          clamp(translateY - scrollDelta, computeMinTranslate(scrollContainer.scrollTop)),
        );
        scheduleSettle();
      };

      const handleInteractionStart = () => {
        clearSettleTimer();
        cancelSettling();
        skipNextSettleAnimation = false;
        previousScrollTop = scrollContainer.scrollTop;
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
        previousScrollTop = scrollContainer.scrollTop;
        root.style.transition = initialTransition;
        root.style.willChange = initialWillChange;
        applyTranslate(0);
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (!SCROLL_KEYS.has(event.key)) return;
        if (!(event.target instanceof Node) || !scrollContainer.contains(event.target)) return;
        skipNextSettleAnimation = true;
        cancelSettling();
      };

      const handleTransitionComplete = (event: TransitionEvent) => {
        if (event.target !== root || event.propertyName !== "translate") return;
        finishSettling();
      };

      const handleReducedMotionChange = () => {
        if (!mediaQuery.matches || !isSettling) return;
        cancelSettling();
        settle();
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
        root.style.translate = initialTranslate;
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
