import { useControllableState } from "@seed-design/react-use-controllable-state";
import { buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import type React from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { isIOS } from "./browser";
import {
  CLOSE_THRESHOLD,
  DRAG_CLASS,
  KEYBOARD_TRANSITION,
  SCROLL_LOCK_TIMEOUT,
  TRANSITIONS,
  VELOCITY_THRESHOLD,
  WINDOW_TOP_OFFSET,
} from "./constants";
import { dampenValue, getTranslate, isInput, isVertical, reset, set } from "./helpers";
import { useSnapPoints } from "./use-snap-points";

interface DrawerReasonToDetailMap {
  // we might add synthetic events later if needed; currently we aim consistency; DismissibleLayer gives us native events
  trigger: { event: MouseEvent };
  closeButton: { event: MouseEvent };
  escapeKeyDown: { event: KeyboardEvent };
  interactOutside: { event: PointerEvent | TouchEvent | FocusEvent };
  drag: { event: PointerEvent };
  handleClickOnLastSnapPoint: { event: MouseEvent };
  cascadeDismiss: { dismissedParent: HTMLElement };
}

type DrawerChangeDetails = {
  [R in keyof DrawerReasonToDetailMap]: {
    reason?: R;
  } & DrawerReasonToDetailMap[R];
}[keyof DrawerReasonToDetailMap];

export interface UseDrawerProps {
  activeSnapPoint?: number | string | null;
  setActiveSnapPoint?: (snapPoint: number | string | null) => void;
  children?: React.ReactNode;
  open?: boolean;
  /**
   * Number between 0 and 1 that determines when the drawer should be closed.
   * Example: threshold of 0.5 would close the drawer if the user swiped for 50% of the height of the drawer or more.
   * @default 0.25
   */
  closeThreshold?: number;
  onOpenChange?: (open: boolean, details?: DrawerChangeDetails) => void;
  /**
   * Duration for which the drawer is not draggable after scrolling content inside of the drawer.
   * @default 500ms
   */
  scrollLockTimeout?: number;
  /**
   * When `true`, don't move the drawer upwards if there's space, but rather only change it's height so it's fully scrollable when the keyboard is open
   */
  fixed?: boolean;
  /**
   * When `true` only allows the drawer to be dragged by the `<Drawer.Handle />` component.
   * @default false
   */
  handleOnly?: boolean;
  /**
   * When `false` dragging, clicking outside, pressing esc, etc. will not close the drawer.
   * Use this in combination with the `open` prop, otherwise you won't be able to open/close the drawer.
   * @default true
   */
  dismissible?: boolean;
  onDrag?: (event: React.PointerEvent<HTMLDivElement>, percentageDragged: number) => void;
  onRelease?: (event: React.PointerEvent<HTMLDivElement>, open: boolean) => void;
  /**
   * When `false` it allows to interact with elements outside of the drawer without closing it.
   * @default true
   */
  modal?: boolean;
  nested?: boolean;
  onClose?: () => void;
  /**
   * Direction of the drawer. Can be `top` or `bottom`, `left`, `right`.
   * @default 'bottom'
   */
  direction?: "top" | "bottom" | "left" | "right";
  /**
   * Opened by default. Still reacts to `open` state changes
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * When `true` Vaul will reposition inputs rather than scroll then into view if the keyboard is in the way.
   * Setting it to `false` will fall back to the default browser behavior.
   * @default true when {@link snapPoints} is defined
   */
  repositionInputs?: boolean;
  /**
   * Disabled velocity based swiping for snap points.
   * This means that a snap point won't be skipped even if the velocity is high enough.
   * Useful if each snap point in a drawer is equally important.
   * @default false
   */
  snapToSequentialPoint?: boolean;
  container?: HTMLElement | null;
  /**
   * Gets triggered after the open or close animation ends, it receives an `open` argument with the `open` state of the drawer by the time the function was triggered.
   * Useful to revert any state changes for example.
   */
  onAnimationEnd?: (open: boolean) => void;
  autoFocus?: boolean;

  /**
   * Array of snap points to use.
   * Example: snapPoints={["100px", "200px", 1]} will use the snap points 100px, 200px and fully open (1 = 100% of the container).
   * @default undefined
   */
  snapPoints?: (number | string)[];

  /**
   * Index of the snap point to start fading from.
   * Example: fadeFromIndex={0} will start fading from the first snap point.
   * @default snapPoints.length - 1
   */
  fadeFromIndex?: number;

  /**
   * Whether to close the drawer when interacting outside of the drawer.
   * @default true
   */
  closeOnInteractOutside?: boolean;

  /**
   * Whether to close the drawer when pressing the escape key.
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Whether to lazy mount the drawer content on first open.
   * @default false
   */
  lazyMount?: boolean;

  /**
   * Whether to unmount the drawer content on exit.
   * @default false
   */
  unmountOnExit?: boolean;
}

export function useDrawer(props: UseDrawerProps) {
  const {
    open: openProp,
    onOpenChange,
    onDrag: onDragProp,
    onRelease: onReleaseProp,
    snapPoints,
    closeThreshold = CLOSE_THRESHOLD,
    scrollLockTimeout = SCROLL_LOCK_TIMEOUT,
    dismissible = true,
    handleOnly = false,
    fadeFromIndex = snapPoints && snapPoints.length - 1,
    activeSnapPoint: activeSnapPointProp,
    setActiveSnapPoint: setActiveSnapPointProp,
    fixed,
    modal = true,
    onClose,
    direction = "bottom",
    defaultOpen = false,
    snapToSequentialPoint = false,
    repositionInputs = true,
    onAnimationEnd,
    container,
    autoFocus = true,
    closeOnInteractOutside = true,
    closeOnEscape = true,
    lazyMount: lazyMountProp = false,
    unmountOnExit: unmountOnExitProp = false,
  } = props;

  const drawerId = useId();
  const titleId = `${drawerId}-title`;
  const descriptionId = `${drawerId}-description`;

  const [isOpen = false, setIsOpen] = useControllableState<boolean, DrawerChangeDetails>({
    defaultProp: defaultOpen,
    prop: openProp,
    onChange: (o: boolean, details?: DrawerChangeDetails) => {
      onOpenChange?.(o, details);

      setTimeout(() => {
        onAnimationEnd?.(o);
      }, TRANSITIONS.EXIT_DURATION * 1000);
    },
  });

  const [hasBeenOpened, setHasBeenOpened] = useState<boolean>(false);
  const [hasAnimationDone, setHasAnimationDone] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [shouldOverlayAnimate, setShouldOverlayAnimate] = useState<boolean>(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const openTime = useRef<Date | null>(null);
  const dragStartTime = useRef<Date | null>(null);
  const dragEndTime = useRef<Date | null>(null);
  const lastTimeDragPrevented = useRef<Date | null>(null);
  const isAllowedToDrag = useRef<boolean>(false);
  const pointerStart = useRef(0);
  const keyboardIsOpen = useRef(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerHeightRef = useRef(drawerRef.current?.getBoundingClientRect().height || 0);
  const drawerWidthRef = useRef(drawerRef.current?.getBoundingClientRect().width || 0);
  const initialDrawerHeight = useRef(0);
  const drawerHeightBeforeKeyboard = useRef<string | null>(null);
  const drawerMinHeightBeforeKeyboard = useRef<string | null>(null);
  const layoutViewportHeightBeforeKeyboard = useRef(
    typeof window === "undefined" ? 0 : window.innerHeight,
  );
  const layoutViewportWidthBeforeKeyboard = useRef(
    typeof window === "undefined" ? 0 : window.innerWidth,
  );
  const keyboardAnimation = useRef<Animation | null>(null);
  const keyboardDismissalPending = useRef(false);

  const onSnapPointChange = useCallback(
    (activeSnapPointIndex: number) => {
      if (snapPoints && activeSnapPointIndex === snapPointsOffset.length - 1) {
        openTime.current = new Date();
      }
    },
    [snapPoints],
  );

  const {
    activeSnapPoint,
    activeSnapPointIndex,
    setActiveSnapPoint,
    onRelease: onReleaseSnapPoints,
    snapPointsOffset,
    onDrag: onDragSnapPoints,
    shouldFade,
    getPercentageDragged: getSnapPointsPercentageDragged,
  } = useSnapPoints({
    snapPoints,
    activeSnapPointProp,
    setActiveSnapPointProp,
    drawerRef,
    fadeFromIndex,
    overlayRef,
    onSnapPointChange,
    direction,
    snapToSequentialPoint,
  });

  // useSnapPoints tracks window dimensions and consequently creates a new empty offsets array on
  // every keyboard-driven window resize. A drawer without snap points must not restart the
  // keyboard effect for that irrelevant array change: doing so creates a listener gap where both
  // native autoFocus and the final visualViewport event can be missed.
  const keyboardSnapPointsOffset = snapPoints?.length ? snapPointsOffset : undefined;
  const keyboardActiveSnapPointIndex = snapPoints?.length ? activeSnapPointIndex : null;

  function onPress(event: React.PointerEvent<HTMLDivElement>) {
    if (!dismissible && !snapPoints) return;
    if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) return;

    drawerHeightRef.current = drawerRef.current?.getBoundingClientRect().height || 0;
    drawerWidthRef.current = drawerRef.current?.getBoundingClientRect().width || 0;
    setIsDragging(true);
    dragStartTime.current = new Date();

    if (isIOS()) {
      window.addEventListener(
        "touchend",
        () => {
          isAllowedToDrag.current = false;
        },
        { once: true },
      );
    }
    (event.target as HTMLElement).setPointerCapture(event.pointerId);

    pointerStart.current = isVertical(direction) ? event.pageY : event.pageX;
  }

  function shouldDrag(el: EventTarget, isDraggingInDirection: boolean) {
    let element = el as HTMLElement;
    const highlightedText = window.getSelection()?.toString();
    const swipeAmount = drawerRef.current ? getTranslate(drawerRef.current, direction) : null;
    const date = new Date();

    if (element.tagName === "SELECT") {
      return false;
    }

    if (element.hasAttribute("data-no-drag") || element.closest("[data-no-drag]")) {
      return false;
    }

    if (direction === "right" || direction === "left") {
      return true;
    }

    if (openTime.current && date.getTime() - openTime.current.getTime() < 500) {
      return false;
    }

    if (swipeAmount !== null) {
      if (direction === "bottom" ? swipeAmount > 0 : swipeAmount < 0) {
        return true;
      }
    }

    if (highlightedText && highlightedText.length > 0) {
      return false;
    }

    if (
      lastTimeDragPrevented.current &&
      date.getTime() - lastTimeDragPrevented.current.getTime() < scrollLockTimeout &&
      swipeAmount === 0
    ) {
      lastTimeDragPrevented.current = date;
      return false;
    }

    if (isDraggingInDirection) {
      lastTimeDragPrevented.current = date;
      return false;
    }

    while (element) {
      if (element.scrollHeight > element.clientHeight) {
        if (element.scrollTop !== 0) {
          lastTimeDragPrevented.current = new Date();
          return false;
        }

        if (element.getAttribute("role") === "dialog") {
          return true;
        }
      }

      element = element.parentNode as HTMLElement;
    }

    return true;
  }

  function onDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!drawerRef.current) return;

    if (isDragging) {
      const directionMultiplier = direction === "bottom" || direction === "right" ? 1 : -1;
      const draggedDistance =
        (pointerStart.current - (isVertical(direction) ? event.pageY : event.pageX)) *
        directionMultiplier;
      const isDraggingInDirection = draggedDistance > 0;

      const noCloseSnapPointsPreCondition = snapPoints && !dismissible && !isDraggingInDirection;

      if (noCloseSnapPointsPreCondition && activeSnapPointIndex === 0) return;

      const absDraggedDistance = Math.abs(draggedDistance);
      const drawerDimension =
        direction === "bottom" || direction === "top"
          ? drawerHeightRef.current
          : drawerWidthRef.current;

      let percentageDragged = absDraggedDistance / drawerDimension;
      const snapPointPercentageDragged = getSnapPointsPercentageDragged(
        absDraggedDistance,
        isDraggingInDirection,
      );

      if (snapPointPercentageDragged !== null) {
        percentageDragged = snapPointPercentageDragged;
      }

      if (noCloseSnapPointsPreCondition && percentageDragged >= 1) {
        return;
      }

      if (!isAllowedToDrag.current && !shouldDrag(event.target, isDraggingInDirection)) return;
      drawerRef.current.classList.add(DRAG_CLASS);

      isAllowedToDrag.current = true;
      set(drawerRef.current, {
        transition: KEYBOARD_TRANSITION,
      });

      set(overlayRef.current, {
        transition: "none",
      });

      if (snapPoints) {
        onDragSnapPoints({ draggedDistance });
      }

      if (isDraggingInDirection && !snapPoints) {
        const dampenedDraggedDistance = dampenValue(draggedDistance);
        const translateValue = Math.min(dampenedDraggedDistance * -1, 0) * directionMultiplier;
        set(drawerRef.current, {
          transform: isVertical(direction)
            ? `translate3d(0, ${translateValue}px, 0)`
            : `translate3d(${translateValue}px, 0, 0)`,
        });
        return;
      }

      const opacityValue = 1 - percentageDragged;

      if (shouldFade || (fadeFromIndex && activeSnapPointIndex === fadeFromIndex - 1)) {
        onDragProp?.(event, percentageDragged);

        set(
          overlayRef.current,
          {
            opacity: `${opacityValue}`,
            transition: "none",
          },
          true,
        );
      }

      if (!snapPoints) {
        const translateValue = absDraggedDistance * directionMultiplier;

        set(drawerRef.current, {
          transform: isVertical(direction)
            ? `translate3d(0, ${translateValue}px, 0)`
            : `translate3d(${translateValue}px, 0, 0)`,
        });
      }
    }
  }

  const cancelDrag = useCallback(() => {
    if (!isDragging || !drawerRef.current) return;

    drawerRef.current.classList.remove(DRAG_CLASS);
    isAllowedToDrag.current = false;
    setIsDragging(false);
    dragEndTime.current = new Date();
  }, [isDragging]);

  const closeDrawer = useCallback(
    (fromWithin?: boolean, details?: DrawerChangeDetails) => {
      cancelDrag();
      onClose?.();

      if (!fromWithin) {
        setIsOpen(false, details);
      }

      if (fadeFromIndex !== undefined && fadeFromIndex > 0 && activeSnapPointIndex === 0) {
        set(overlayRef.current, {
          opacity: "0",
        });
      }

      setTimeout(() => {
        if (snapPoints) {
          setActiveSnapPoint(snapPoints[0]);
        }
      }, TRANSITIONS.EXIT_DURATION * 1000);
    },
    [
      cancelDrag,
      onClose,
      snapPoints,
      setActiveSnapPoint,
      setIsOpen,
      fadeFromIndex,
      activeSnapPointIndex,
    ],
  );

  function resetDrawer() {
    if (!drawerRef.current) return;

    set(drawerRef.current, {
      transform: "translate3d(0, 0, 0)",
      transition: `transform ${TRANSITIONS.EXIT_DURATION}s ${TRANSITIONS.CONTENT_EXIT_TIMING_FUNCTION}, ${KEYBOARD_TRANSITION}`,
    });

    set(overlayRef.current, {
      transition: `opacity ${TRANSITIONS.EXIT_DURATION}s ${TRANSITIONS.OVERLAY_EXIT_TIMING_FUNCTION}`,
      opacity: "1",
    });
  }

  function onRelease(event: React.PointerEvent<HTMLDivElement> | null) {
    if (!isDragging || !drawerRef.current) return;

    drawerRef.current.classList.remove(DRAG_CLASS);
    isAllowedToDrag.current = false;
    setIsDragging(false);
    dragEndTime.current = new Date();
    const swipeAmount = getTranslate(drawerRef.current, direction);

    if (!event || !shouldDrag(event.target, false) || !swipeAmount || Number.isNaN(swipeAmount))
      return;

    if (dragStartTime.current === null) return;

    const timeTaken = dragEndTime.current.getTime() - dragStartTime.current.getTime();
    const distMoved = pointerStart.current - (isVertical(direction) ? event.pageY : event.pageX);
    const velocity = Math.abs(distMoved) / timeTaken;

    if (snapPoints) {
      const directionMultiplier = direction === "bottom" || direction === "right" ? 1 : -1;
      onReleaseSnapPoints({
        draggedDistance: distMoved * directionMultiplier,
        closeDrawer,
        velocity,
        dismissible,
        event: event.nativeEvent,
      });
      onReleaseProp?.(event, true);
      return;
    }

    if (direction === "bottom" || direction === "right" ? distMoved > 0 : distMoved < 0) {
      resetDrawer();
      onReleaseProp?.(event, true);
      return;
    }

    if (velocity > VELOCITY_THRESHOLD) {
      closeDrawer(false, { reason: "drag", event: event.nativeEvent });
      onReleaseProp?.(event, false);
      return;
    }

    const visibleDrawerHeight = Math.min(
      drawerRef.current.getBoundingClientRect().height ?? 0,
      window.innerHeight,
    );
    const visibleDrawerWidth = Math.min(
      drawerRef.current.getBoundingClientRect().width ?? 0,
      window.innerWidth,
    );

    const isHorizontalSwipe = direction === "left" || direction === "right";
    if (
      Math.abs(swipeAmount) >=
      (isHorizontalSwipe ? visibleDrawerWidth : visibleDrawerHeight) * closeThreshold
    ) {
      closeDrawer(false, { reason: "drag", event: event.nativeEvent });
      onReleaseProp?.(event, false);
      return;
    }

    onReleaseProp?.(event, true);
    resetDrawer();
  }

  useEffect(() => {
    if (isOpen) {
      set(document.documentElement, {
        scrollBehavior: "auto",
      });
      openTime.current = new Date();
    }

    return () => {
      reset(document.documentElement, "scrollBehavior");
    };
  }, [isOpen]);

  useEffect(() => {
    let keyboardRepositionFrame: number | null = null;
    let keyboardRepositionTimeout: number | null = null;

    function updateLayoutViewportBaseline() {
      const widthChanged =
        Math.abs(layoutViewportWidthBeforeKeyboard.current - window.innerWidth) > 1;

      if (widthChanged) {
        // A real viewport-width change (for example device rotation) starts a new baseline. During
        // ordinary keyboard transitions iOS can shrink innerHeight while width stays unchanged, so
        // never let that transient height replace the larger keyboard-closed measurement.
        layoutViewportWidthBeforeKeyboard.current = window.innerWidth;
        layoutViewportHeightBeforeKeyboard.current = window.innerHeight;
        return;
      }

      layoutViewportHeightBeforeKeyboard.current = Math.max(
        layoutViewportHeightBeforeKeyboard.current,
        window.innerHeight,
      );
    }

    function getScrollableAncestor(target: Element): HTMLElement | null {
      const drawer = drawerRef.current;
      let ancestor = target.parentElement;

      while (ancestor && ancestor !== drawer) {
        const style = getComputedStyle(ancestor);
        const scrollsVertically = /(auto|scroll)/.test(`${style.overflow} ${style.overflowY}`);

        if (scrollsVertically && ancestor.scrollHeight > ancestor.clientHeight) {
          return ancestor;
        }

        ancestor = ancestor.parentElement;
      }

      return null;
    }

    function scrollFocusedInputIntoView() {
      const drawer = drawerRef.current;
      const focusedElement = document.activeElement;
      if (!drawer || !(focusedElement instanceof HTMLElement) || !isInput(focusedElement)) return;
      if (!drawer.contains(focusedElement)) return;

      // `scrollIntoView({ container: "nearest" })` would express this directly, but Safari does
      // not support the container option yet. Moving only the closest overflowing ancestor keeps
      // iOS from scrolling the page or the drawer itself while the keyboard changes the viewport.
      const scrollable = getScrollableAncestor(focusedElement);
      if (!scrollable) return;

      const visualViewport = window.visualViewport;
      const scrollableRect = scrollable.getBoundingClientRect();
      const targetRect = focusedElement.getBoundingClientRect();
      const viewportTop = visualViewport?.offsetTop ?? 0;
      const viewportBottom = viewportTop + (visualViewport?.height ?? window.innerHeight);
      const visibleTop = Math.max(scrollableRect.top, viewportTop);
      const visibleBottom = Math.min(scrollableRect.bottom, viewportBottom);

      if (visibleBottom <= visibleTop) return;

      let adjustment = 0;
      if (targetRect.top < visibleTop) {
        adjustment = targetRect.top - visibleTop;
      } else if (targetRect.bottom > visibleBottom) {
        adjustment = targetRect.bottom - visibleBottom;
      }

      if (Math.abs(adjustment) < 0.5) return;

      scrollable.scrollTo({
        top: Math.max(
          0,
          Math.min(
            scrollable.scrollHeight - scrollable.clientHeight,
            scrollable.scrollTop + adjustment,
          ),
        ),
        behavior: "smooth",
      });
    }

    function getKeyboardAnimationOptions(drawer: HTMLDivElement): KeyframeAnimationOptions | null {
      const transition = getComputedStyle(drawer)
        .getPropertyValue("--drawer-keyboard-transition")
        .trim();
      const durationMatch = transition.match(/(?:^|\s)(\d*\.?\d+)(ms|s)(?=\s|$)/);

      if (!durationMatch) return null;

      const durationValue = Number.parseFloat(durationMatch[1]);
      const duration = durationMatch[2] === "s" ? durationValue * 1000 : durationValue;

      if (!Number.isFinite(duration) || duration <= 0) return null;

      const easing = transition.match(
        /cubic-bezier\([^)]*\)|steps\([^)]*\)|linear\([^)]*\)|ease-in-out|ease-in|ease-out|ease|linear/,
      )?.[0];

      return {
        duration,
        easing: easing || "ease",
        fill: "both",
      };
    }

    function updateDrawerGeometry(updateSize: (drawer: HTMLDivElement) => void, bottom: number) {
      const drawer = drawerRef.current;
      if (!drawer) return;

      const animationOptions = getKeyboardAnimationOptions(drawer);
      const previousRect = drawer.getBoundingClientRect();
      const computedBottom = Number.parseFloat(getComputedStyle(drawer).bottom);
      const previousBottom = Number.isFinite(computedBottom)
        ? computedBottom
        : Math.max(window.innerHeight - previousRect.bottom, 0);

      keyboardAnimation.current?.cancel();
      keyboardAnimation.current = null;

      const previousKeyboardTransition = drawer.style.getPropertyValue(
        "--drawer-keyboard-transition",
      );

      // First commit the final size and position without a CSS transition. Safari can otherwise
      // paint the synchronous height change before it starts the `bottom` transition, exposing a
      // frame where the sheet briefly shrinks toward the bottom or grows above the viewport.
      drawer.style.setProperty("--drawer-keyboard-transition", "bottom 0s");
      updateSize(drawer);
      drawer.style.bottom = `${bottom}px`;
      const nextRect = drawer.getBoundingClientRect();
      const nextHeight = drawer.style.height;
      const nextMinHeight = drawer.style.minHeight;
      const nextBottom = drawer.style.bottom;

      if (
        !animationOptions ||
        typeof drawer.animate !== "function" ||
        (Math.abs(previousRect.height - nextRect.height) < 0.5 &&
          Math.abs(previousBottom - bottom) < 0.5)
      ) {
        if (previousKeyboardTransition) {
          drawer.style.setProperty("--drawer-keyboard-transition", previousKeyboardTransition);
        } else {
          drawer.style.removeProperty("--drawer-keyboard-transition");
        }
        return;
      }

      // WAAPI keeps height and bottom on one timeline. The underlying layout is already at its
      // final geometry before playback, so canceling or finishing the animation cannot expose an
      // intermediate CSS layout. Animating the individual geometry properties also leaves the
      // drawer's transform available for its open, drag, and snap-point interactions.
      //
      // Safari does not necessarily sample a newly-created animation until the next frame. Keep
      // the authored layout at the previous geometry, pause at the first keyframe, and force that
      // keyframe to be sampled before committing the final underlying layout. Otherwise Safari
      // can paint `final -> first keyframe -> final`, which looks like the sheet bouncing twice.
      drawer.style.height = `${previousRect.height}px`;
      drawer.style.minHeight = `${previousRect.height}px`;
      drawer.style.bottom = `${previousBottom}px`;

      const animation = drawer.animate(
        [
          {
            height: `${previousRect.height}px`,
            minHeight: `${previousRect.height}px`,
            bottom: `${previousBottom}px`,
          },
          {
            height: `${nextRect.height}px`,
            minHeight: `${nextRect.height}px`,
            bottom: `${bottom}px`,
          },
        ],
        animationOptions,
      );

      animation.pause();
      animation.currentTime = 0;
      drawer.getBoundingClientRect();

      drawer.style.height = nextHeight;
      drawer.style.minHeight = nextMinHeight;
      drawer.style.bottom = nextBottom;
      drawer.getBoundingClientRect();

      if (previousKeyboardTransition) {
        drawer.style.setProperty("--drawer-keyboard-transition", previousKeyboardTransition);
      } else {
        drawer.style.removeProperty("--drawer-keyboard-transition");
      }

      keyboardAnimation.current = animation;
      animation.play();
      void animation.finished.then(
        () => {
          if (keyboardAnimation.current === animation) {
            keyboardAnimation.current = null;
            animation.cancel();
            scrollFocusedInputIntoView();
          }
        },
        () => {},
      );
    }

    function captureDrawerHeight() {
      const drawer = drawerRef.current;
      if (!drawer) return false;
      if (drawerHeightBeforeKeyboard.current !== null) {
        return initialDrawerHeight.current > 0;
      }

      const drawerHeight = drawer.getBoundingClientRect().height || 0;
      if (!Number.isFinite(drawerHeight) || drawerHeight <= 0) return false;

      drawerHeightBeforeKeyboard.current = drawer.style.height;
      drawerMinHeightBeforeKeyboard.current = drawer.style.minHeight;
      initialDrawerHeight.current = drawerHeight;
      return true;
    }

    function restoreDrawerHeight() {
      if (!drawerRef.current || drawerHeightBeforeKeyboard.current === null) return;

      updateDrawerGeometry((drawer) => {
        drawer.style.height = drawerHeightBeforeKeyboard.current ?? "";
        drawer.style.minHeight = drawerMinHeightBeforeKeyboard.current ?? "";
      }, 0);
      drawerHeightBeforeKeyboard.current = null;
      drawerMinHeightBeforeKeyboard.current = null;
      initialDrawerHeight.current = 0;
    }

    function reconcileFocusedInput() {
      const focusedElement = document.activeElement;
      if (
        !(focusedElement instanceof HTMLElement) ||
        !isInput(focusedElement) ||
        !drawerRef.current?.contains(focusedElement)
      ) {
        return;
      }

      if (captureDrawerHeight()) onVisualViewportChange();
    }

    function scheduleKeyboardReposition() {
      if (keyboardRepositionFrame === null) {
        keyboardRepositionFrame = window.requestAnimationFrame(() => {
          keyboardRepositionFrame = null;
          reconcileFocusedInput();
        });
      }

      if (keyboardRepositionTimeout === null) {
        // A quick close-and-reopen can reverse the native keyboard animation without producing a
        // final visualViewport event after this effect is attached. Reconcile once more after both
        // drawer transition durations so the settled viewport always wins.
        keyboardRepositionTimeout = window.setTimeout(
          () => {
            keyboardRepositionTimeout = null;
            reconcileFocusedInput();
          },
          (TRANSITIONS.ENTER_DURATION + TRANSITIONS.EXIT_DURATION) * 1000,
        );
      }
    }

    function onVisualViewportChange() {
      if (!repositionInputs) return;
      if (!isOpen) {
        updateLayoutViewportBaseline();
        return;
      }
      if (!drawerRef.current) return;
      // Pinch zoom shrinks the visual viewport for reasons that have nothing to do with the
      // keyboard, so `diffFromInitial` below would read the zoom as keyboard height and resize the
      // drawer to match. Leave it alone until the zoom is released.
      if ((window.visualViewport?.scale ?? 1) > 1) return;

      const focusedElement = document.activeElement as HTMLElement;
      const visualViewportHeight = window.visualViewport?.height || 0;
      const visualViewportOffsetTop = window.visualViewport?.offsetTop || 0;
      // During a quick keyboard close-and-reopen Safari can temporarily shrink window.innerHeight
      // to the visual viewport as well. Comparing those two live values would then report no
      // keyboard even though it is visible. Keep the layout viewport measured while the drawer was
      // closed (or before focus) as the stable baseline for this keyboard session.
      const totalHeight = Math.max(layoutViewportHeightBeforeKeyboard.current, window.innerHeight);
      const viewportHeightReduction = totalHeight - visualViewportHeight;
      let keyboardInset = viewportHeightReduction - visualViewportOffsetTop;
      const wasKeyboardOpen = keyboardIsOpen.current;
      const isKeyboardOpen = viewportHeightReduction > 60;

      // focusout starts the downward animation before iOS reports the keyboard dismissal through
      // visualViewport. Ignore the stale keyboard-open resize/scroll events in between, otherwise
      // they cancel that animation and lift the sheet again. A new input focus cancels this guard.
      if (keyboardDismissalPending.current) {
        if (!isKeyboardOpen) {
          keyboardDismissalPending.current = false;
          keyboardIsOpen.current = false;
          updateLayoutViewportBaseline();
        }
        return;
      }

      keyboardIsOpen.current = isKeyboardOpen;

      if (!isInput(focusedElement) && !wasKeyboardOpen && !isKeyboardOpen) return;

      if (!isKeyboardOpen) {
        restoreDrawerHeight();
        return;
      }

      if (!captureDrawerHeight()) {
        scheduleKeyboardReposition();
        return;
      }

      if (keyboardSnapPointsOffset && keyboardActiveSnapPointIndex) {
        const activeSnapPointHeight =
          keyboardSnapPointsOffset[keyboardActiveSnapPointIndex] || 0;
        keyboardInset += activeSnapPointHeight;
      }

      // Derive the height from the natural height and the viewport alone. Measuring the drawer
      // here would be circular: `bottom` animates toward the keyboard position, so a rect read
      // mid-flight describes where the drawer was rather than where it is headed, and folding
      // that back into the height makes every resize compound the last one. Android emits
      // several resizes per keyboard animation, so that compounding inflated the sheet until it
      // filled the screen.
      const naturalHeight = initialDrawerHeight.current;
      // Once lifted, the drawer's bottom edge rests on top of the keyboard, so this is all the
      // room it has left.
      const availableHeight = visualViewportHeight - WINDOW_TOP_OFFSET;
      const targetHeight = fixed
        ? Math.max(naturalHeight - Math.max(keyboardInset, 0), 0)
        : Math.min(naturalHeight, availableHeight);

      // iOS can pan the visual viewport to reveal the focused input. That pan already moves the
      // sheet up on screen, so only lift it by the keyboard-covered part that remains below the
      // visual viewport. Ignoring offsetTop applies both movements and hides the sheet header.
      updateDrawerGeometry(
        (drawer) => {
          drawer.style.height = `${targetHeight}px`;
          drawer.style.minHeight = `${targetHeight}px`;
        },
        Math.max(keyboardInset, 0),
      );
      scrollFocusedInputIntoView();
    }

    let focusOutSequence = 0;

    function onFocusIn(event: FocusEvent) {
      const target = event.target;
      if (!repositionInputs || !(target instanceof Element) || !isInput(target)) return;
      if (!drawerRef.current?.contains(target)) return;

      focusOutSequence += 1;
      keyboardDismissalPending.current = false;
      updateLayoutViewportBaseline();
      if (!captureDrawerHeight()) scheduleKeyboardReposition();

      const visualViewportHeight = window.visualViewport?.height ?? window.innerHeight;
      if (keyboardIsOpen.current || window.innerHeight - visualViewportHeight > 60) {
        onVisualViewportChange();
      }
      scheduleKeyboardReposition();
    }

    function onFocusOut(event: FocusEvent) {
      const target = event.target;
      if (!repositionInputs || !(target instanceof Element) || !isInput(target)) return;
      if (!drawerRef.current?.contains(target)) return;
      if ((window.visualViewport?.scale ?? 1) > 1) return;

      const relatedTarget = event.relatedTarget;
      if (
        relatedTarget instanceof Element &&
        isInput(relatedTarget) &&
        drawerRef.current?.contains(relatedTarget)
      ) {
        return;
      }

      // iOS reports a null relatedTarget for the keyboard Done button. Let focus settle in the
      // current task so input-to-input moves can be detected, but start the restore before the next
      // frame; visually this is immediate and does not wait for the delayed visualViewport resize.
      const sequence = ++focusOutSequence;
      queueMicrotask(() => {
        if (sequence !== focusOutSequence) return;

        const activeElement = document.activeElement;
        if (
          activeElement instanceof Element &&
          isInput(activeElement) &&
          drawerRef.current?.contains(activeElement)
        ) {
          return;
        }

        keyboardDismissalPending.current = true;
        restoreDrawerHeight();
      });
    }

    if (!isOpen) {
      const drawer = drawerRef.current;

      keyboardAnimation.current?.cancel();
      keyboardAnimation.current = null;

      if (drawer && drawerHeightBeforeKeyboard.current !== null) {
        drawer.style.height = drawerHeightBeforeKeyboard.current;
        drawer.style.minHeight = drawerMinHeightBeforeKeyboard.current ?? "";
        drawer.style.bottom = "0px";
      }

      drawerHeightBeforeKeyboard.current = null;
      drawerMinHeightBeforeKeyboard.current = null;
      initialDrawerHeight.current = 0;
      updateLayoutViewportBaseline();
      keyboardDismissalPending.current = false;
      keyboardIsOpen.current = false;
    }

    window.visualViewport?.addEventListener("resize", onVisualViewportChange);
    window.visualViewport?.addEventListener("scroll", onVisualViewportChange);
    document.addEventListener("focusin", onFocusIn, true);
    if (isIOS()) {
      document.addEventListener("focusout", onFocusOut, true);
    }

    // Native `autoFocus` runs during the commit that opens the drawer. The focus and the first
    // visualViewport resize can therefore both happen before this effect is re-attached for the
    // open state. Reconcile the already-focused input once so that path does not leave the sheet
    // underneath the keyboard.
    const focusedElement = document.activeElement;
    if (
      isOpen &&
      focusedElement instanceof HTMLElement &&
      isInput(focusedElement) &&
      drawerRef.current?.contains(focusedElement)
    ) {
      // The previous drawer can close before iOS reports that its keyboard finished dismissing.
      // In that case the dismissal guard survives into the next open. Native autoFocus can also
      // happen between this effect's cleanup and setup, so there may be no focusin event to clear
      // the guard. Treat the already-focused input as a new focus sequence before reconciling the
      // current viewport.
      focusOutSequence += 1;
      keyboardDismissalPending.current = false;
      if (captureDrawerHeight()) onVisualViewportChange();
      else scheduleKeyboardReposition();
      scheduleKeyboardReposition();
    }

    return () => {
      focusOutSequence += 1;
      if (keyboardRepositionFrame !== null) {
        window.cancelAnimationFrame(keyboardRepositionFrame);
      }
      if (keyboardRepositionTimeout !== null) {
        window.clearTimeout(keyboardRepositionTimeout);
      }
      keyboardAnimation.current?.cancel();
      keyboardAnimation.current = null;
      window.visualViewport?.removeEventListener("resize", onVisualViewportChange);
      window.visualViewport?.removeEventListener("scroll", onVisualViewportChange);
      document.removeEventListener("focusin", onFocusIn, true);
      if (isIOS()) {
        document.removeEventListener("focusout", onFocusOut, true);
      }
    };
  }, [keyboardActiveSnapPointIndex, keyboardSnapPointsOffset, repositionInputs, fixed, isOpen]);

  // Effect 1: Track drawer open state
  useEffect(() => {
    if (isOpen) {
      setHasBeenOpened(true);
    }
  }, [isOpen]);

  // Effect 2: Handle animation state and timer
  useEffect(() => {
    if (isOpen) {
      // Only reset animation state if this is the first open
      if (!hasBeenOpened) {
        setHasAnimationDone(false);
      }

      const timeoutId = setTimeout(() => {
        setHasAnimationDone(true);
      }, TRANSITIONS.ENTER_DURATION * 1000);

      return () => clearTimeout(timeoutId);
    }

    // Reset animation state when drawer closes
    setHasAnimationDone(false);
  }, [isOpen, hasBeenOpened]);

  useEffect(() => {
    if (isOpen && snapPoints && fadeFromIndex === 0) {
      setShouldOverlayAnimate(true);

      const timeoutId = setTimeout(() => {
        setShouldOverlayAnimate(false);
      }, TRANSITIONS.ENTER_DURATION * 1000);

      return () => clearTimeout(timeoutId);
    }

    setShouldOverlayAnimate(false);
  }, [isOpen, snapPoints, fadeFromIndex]);

  const stateProps = useMemo(
    () =>
      elementProps({
        "data-open": dataAttr(isOpen),
      }),
    [isOpen],
  );

  return useMemo(
    () => ({
      activeSnapPoint,
      snapPoints,
      setActiveSnapPoint,
      drawerRef,
      overlayRef,
      shouldOverlayAnimate,
      onOpenChange,
      onPress,
      onRelease,
      onDrag,
      dismissible,
      handleOnly,
      isOpen,
      isDragging,
      shouldFade,
      closeDrawer,
      keyboardIsOpen,
      modal,
      snapPointsOffset,
      activeSnapPointIndex,
      direction,
      container,
      autoFocus,
      setHasBeenOpened,
      setIsOpen,
      closeOnInteractOutside,
      closeOnEscape,
      titleId,
      descriptionId,
      lazyMount: lazyMountProp,
      unmountOnExit: unmountOnExitProp,
      hasAnimationDone,

      triggerProps: buttonProps({
        ...stateProps,
        onClick: (e) => {
          if (e.defaultPrevented) return;
          setIsOpen(true, { reason: "trigger", event: e.nativeEvent });
        },
      }),
      positionerProps: elementProps({
        ...stateProps,
        style: {
          pointerEvents: isOpen && modal ? undefined : "none",
        },
      }),
      backdropProps: elementProps({
        ...stateProps,
      }),
      titleProps: elementProps({
        id: titleId,
        ...stateProps,
      }),
      descriptionProps: elementProps({
        id: descriptionId,
        ...stateProps,
      }),
      headerProps: elementProps({
        ...stateProps,
      }),
      closeButtonProps: buttonProps({
        ...stateProps,
        onClick: (e) => {
          if (e.defaultPrevented) return;
          setIsOpen(false, { reason: "closeButton", event: e.nativeEvent });
        },
      }),
    }),
    [
      activeSnapPoint,
      snapPoints,
      setActiveSnapPoint,
      onOpenChange,
      dismissible,
      handleOnly,
      isOpen,
      isDragging,
      shouldFade,
      shouldOverlayAnimate,
      closeDrawer,
      modal,
      snapPointsOffset,
      activeSnapPointIndex,
      direction,
      container,
      autoFocus,
      setIsOpen,
      closeOnInteractOutside,
      closeOnEscape,
      onRelease,
      onDrag,
      onPress,
      titleId,
      descriptionId,
      lazyMountProp,
      unmountOnExitProp,
      hasAnimationDone,
      stateProps,
    ],
  );
}
