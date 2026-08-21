import { useControllableState } from "@seed-design/react-use-controllable-state";
import { buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import type React from "react";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { isIOS } from "./browser";
import {
  CLOSE_THRESHOLD,
  DEFAULT_KEYBOARD_TRANSITION,
  DRAG_CLASS,
  KEYBOARD_TRANSITION,
  SCROLL_LOCK_TIMEOUT,
  TRANSITIONS,
  VELOCITY_THRESHOLD,
  WINDOW_TOP_OFFSET,
} from "./constants";
import { dampenValue, getTranslate, isInput, isVertical, reset, set } from "./helpers";
import { useSnapPoints } from "./use-snap-points";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
  const keyboardAnimationTarget = useRef<{
    height: number;
    minHeight: number;
    bottom: number;
  } | null>(null);
  const keyboardEntryAnimation = useRef<Animation | null>(null);
  const keyboardEntrySnapshot = useRef<{
    top: number;
    offsetTop: number;
    target: Element | null;
  } | null>(null);
  const keyboardEntryConsumed = useRef(true);
  const keyboardDismissalPending = useRef(false);
  const keyboardDismissalGeometry = useRef<{ height: number; bottom: number } | null>(null);
  // Android dispatches focusin before its IME has resized the layout viewport. Keep the
  // keyboard-closed pixel geometry captured for that focus until the first actual keyboard
  // resize; otherwise the focus RAF restores authored `vh` styles during the native gap.
  const keyboardFocusPending = useRef(false);

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
  const hasKeyboardEntryMotion = direction === "bottom" && !snapPoints?.length;

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
      keyboardEntryAnimation.current?.cancel();
      keyboardEntryAnimation.current = null;
      keyboardEntrySnapshot.current = null;
      keyboardEntryConsumed.current = true;
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
      keyboardEntryAnimation.current?.cancel();
      keyboardEntryAnimation.current = null;
      keyboardEntrySnapshot.current = null;
      keyboardEntryConsumed.current = true;
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

  useIsomorphicLayoutEffect(() => {
    if (!isOpen || !repositionInputs || !drawerRef.current) return;

    // Android WebView can apply adjustResize between native autoFocus and the passive keyboard
    // effect below. Preserve the keyboard-closed geometry during the layout phase so viewport-unit
    // minimum heights (for example 70vh) are not re-evaluated against the already-shrunken window.
    const drawerHeight = drawerRef.current.getBoundingClientRect().height || 0;
    if (Number.isFinite(drawerHeight) && drawerHeight > 0) {
      drawerHeightRef.current = drawerHeight;
    }

    // Capture the keyboard-closed screen position during the opening commit as well. Native
    // autoFocus can run before the passive focus listener below is attached, but the FLIP start
    // position still has to describe the sheet the user actually saw before the keyboard resize.
    if (hasKeyboardEntryMotion && !keyboardIsOpen.current) {
      const activeElement = document.activeElement;
      const focusedInput =
        activeElement instanceof Element &&
        isInput(activeElement) &&
        drawerRef.current.contains(activeElement)
          ? activeElement
          : null;
      const top = drawerRef.current.getBoundingClientRect().top;
      if (Number.isFinite(top)) {
        keyboardEntrySnapshot.current = {
          top,
          offsetTop: window.visualViewport?.offsetTop ?? 0,
          target: focusedInput,
        };
        // Keep an unfocused opening snapshot provisional. A later pointer/focus event replaces it;
        // the passive autofocus reconciliation below activates it only when native autofocus ran
        // between commit and listener setup.
        keyboardEntryConsumed.current = focusedInput === null;
      }
    }
  }, [hasKeyboardEntryMotion, isOpen, repositionInputs]);

  useEffect(() => {
    let keyboardRepositionFrame: number | null = null;
    let keyboardRepositionTimeout: number | null = null;
    let focusedInputScrollFrame: number | null = null;
    let focusedInputScrollTarget: { element: HTMLElement; top: number } | null = null;

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

    function getSafeAreaTop() {
      const safeAreaTop = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--seed-safe-area-top"),
      );

      return Number.isFinite(safeAreaTop) ? Math.max(safeAreaTop, 0) : 0;
    }

    function prefersReducedMotion() {
      return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
    }

    function getKeyboardClosedViewportMinHeight(drawer: HTMLDivElement) {
      const match = drawer.style.minHeight.trim().match(/^(-?\d*\.?\d+)(?:d|s|l)?vh$/i);
      if (!match) return 0;

      const percentage = Number.parseFloat(match[1]);
      if (!Number.isFinite(percentage)) return 0;

      const keyboardClosedViewportHeight = Math.max(
        layoutViewportHeightBeforeKeyboard.current,
        window.innerHeight,
      );

      return Math.max((keyboardClosedViewportHeight * percentage) / 100, 0);
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
      // Android `adjustResize` can update the layout viewport one event before VisualViewport.
      // The smaller layout viewport is the only visible area in that interval.
      const viewportTop = isIOS() ? (visualViewport?.offsetTop ?? 0) : 0;
      const viewportHeight = isIOS()
        ? (visualViewport?.height ?? window.innerHeight)
        : Math.min(visualViewport?.height ?? window.innerHeight, window.innerHeight);
      const viewportBottom = viewportTop + viewportHeight;
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

      const top = Math.max(
        0,
        Math.min(
          scrollable.scrollHeight - scrollable.clientHeight,
          scrollable.scrollTop + adjustment,
        ),
      );

      // Keyboard animation emits several viewport events. Reissuing the same smooth scroll on
      // every event restarts WebKit's scroll animation, which makes the sheet arrive first and
      // the focused input follow noticeably later. Keep a single in-flight destination instead.
      if (
        focusedInputScrollTarget?.element === scrollable &&
        Math.abs(focusedInputScrollTarget.top - top) < 0.5
      ) {
        return;
      }

      focusedInputScrollTarget = { element: scrollable, top };
      scrollable.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }

    function scheduleFocusedInputScroll() {
      if (focusedInputScrollFrame !== null) return;

      // A focus event is delivered before React commits focus-driven content such as an
      // autocomplete list. The first frame handles already-mounted content; the second catches
      // the React commit without waiting for the drawer animation to finish.
      focusedInputScrollFrame = window.requestAnimationFrame(() => {
        scrollFocusedInputIntoView();
        focusedInputScrollFrame = window.requestAnimationFrame(() => {
          focusedInputScrollFrame = null;
          scrollFocusedInputIntoView();
        });
      });
    }

    function getKeyboardAnimationOptions(drawer: HTMLDivElement): KeyframeAnimationOptions | null {
      const transition =
        getComputedStyle(drawer).getPropertyValue("--drawer-keyboard-transition").trim() ||
        DEFAULT_KEYBOARD_TRANSITION;
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

    function getNonOvershootingEasing(easing: string | undefined) {
      if (!easing) return TRANSITIONS.CONTENT_ENTER_TIMING_FUNCTION;
      if (/^(linear|ease|ease-in|ease-out|ease-in-out|steps\([^)]*\))$/.test(easing)) {
        return easing;
      }

      const cubicBezier = easing.match(
        /^cubic-bezier\(\s*[-+]?\d*\.?\d+\s*,\s*([-+]?\d*\.?\d+)\s*,\s*[-+]?\d*\.?\d+\s*,\s*([-+]?\d*\.?\d+)\s*\)$/,
      );
      if (!cubicBezier) return TRANSITIONS.CONTENT_ENTER_TIMING_FUNCTION;

      const firstY = Number.parseFloat(cubicBezier[1]);
      const secondY = Number.parseFloat(cubicBezier[2]);
      return firstY >= 0 && firstY <= 1 && secondY >= 0 && secondY <= 1
        ? easing
        : TRANSITIONS.CONTENT_ENTER_TIMING_FUNCTION;
    }

    function cancelKeyboardEntryAnimation() {
      keyboardEntryAnimation.current?.cancel();
      keyboardEntryAnimation.current = null;
    }

    function captureKeyboardEntrySnapshot(target: Element | null) {
      if (
        !hasKeyboardEntryMotion ||
        keyboardIsOpen.current ||
        keyboardEntryConsumed.current === false
      ) {
        return;
      }

      const drawer = drawerRef.current;
      if (!drawer) return;

      const top = drawer.getBoundingClientRect().top;
      if (!Number.isFinite(top)) return;

      cancelKeyboardEntryAnimation();
      keyboardEntrySnapshot.current = {
        top,
        offsetTop: window.visualViewport?.offsetTop ?? 0,
        target,
      };
      keyboardEntryConsumed.current = false;
    }

    function animateKeyboardEntry(finalTopInset: number) {
      if (keyboardEntryConsumed.current) return false;

      const drawer = drawerRef.current;
      const snapshot = keyboardEntrySnapshot.current;
      keyboardEntryConsumed.current = true;
      keyboardEntrySnapshot.current = null;

      if (!drawer || !snapshot || !hasKeyboardEntryMotion) {
        return false;
      }

      const animationOptions = getKeyboardAnimationOptions(drawer);
      const finalRect = drawer.getBoundingClientRect();
      const currentOffsetTop = window.visualViewport?.offsetTop ?? 0;
      const deltaY = snapshot.top + snapshot.offsetTop - (finalRect.top + currentOffsetTop);
      const computedTranslate = getComputedStyle(drawer).translate;
      const hasAuthoredTranslate =
        computedTranslate !== undefined &&
        computedTranslate !== "" &&
        computedTranslate !== "none" &&
        computedTranslate !== "0px" &&
        computedTranslate !== "0px 0px" &&
        computedTranslate !== "0px 0px 0px";
      const supportsTranslate =
        typeof CSS === "undefined" ||
        typeof CSS.supports !== "function" ||
        CSS.supports("translate", "0px 1px");

      if (
        prefersReducedMotion() ||
        !animationOptions ||
        typeof drawer.animate !== "function" ||
        !supportsTranslate ||
        hasAuthoredTranslate ||
        !Number.isFinite(deltaY) ||
        deltaY < 0.5 ||
        snapshot.top < finalTopInset - 0.5 ||
        finalRect.top < finalTopInset - 0.5
      ) {
        return false;
      }

      cancelKeyboardEntryAnimation();

      try {
        const options = {
          ...animationOptions,
          easing: getNonOvershootingEasing(animationOptions.easing),
        };
        const animation = drawer.animate(
          [{ translate: `0px ${deltaY}px` }, { translate: "0px 0px" }],
          options,
        );

        // The final layout is already committed. Sample the first compositor keyframe in this
        // task so neither WebKit nor Android WebView can paint the final position before playback.
        animation.pause();
        animation.currentTime = 0;
        drawer.getBoundingClientRect();

        keyboardEntryAnimation.current = animation;
        animation.play();
        void animation.finished.then(
          () => {
            if (keyboardEntryAnimation.current === animation) {
              keyboardEntryAnimation.current = null;
              animation.cancel();
              focusedInputScrollTarget = null;
              scheduleFocusedInputScroll();
            }
          },
          () => {},
        );
        return true;
      } catch {
        keyboardEntryAnimation.current = null;
        return false;
      }
    }

    function updateDrawerGeometry(
      updateSize: (drawer: HTMLDivElement) => void,
      bottom: number,
      previousGeometry?: { height: number; bottom: number } | null,
      shouldAnimate = true,
    ) {
      const drawer = drawerRef.current;
      if (!drawer) return;

      const animationOptions = getKeyboardAnimationOptions(drawer);
      const measuredPreviousRect = drawer.getBoundingClientRect();
      const previousRect = previousGeometry ?? measuredPreviousRect;
      const computedBottom = Number.parseFloat(getComputedStyle(drawer).bottom);
      const previousBottom = previousGeometry
        ? Math.max(window.innerHeight - previousGeometry.bottom, 0)
        : Number.isFinite(computedBottom)
          ? computedBottom
          : Math.max(window.innerHeight - previousRect.bottom, 0);

      const previousKeyboardTransition = drawer.style.getPropertyValue(
        "--drawer-keyboard-transition",
      );

      // First commit the final size and position without a CSS transition. Safari can otherwise
      // paint the synchronous height change before it starts the `bottom` transition, exposing a
      // frame where the sheet briefly shrinks toward the bottom or grows above the viewport.
      drawer.style.setProperty("--drawer-keyboard-transition", "bottom 0s");
      updateSize(drawer);
      drawer.style.bottom = `${bottom}px`;
      const nextHeight = drawer.style.height;
      const nextMinHeight = drawer.style.minHeight;
      const nextBottom = drawer.style.bottom;
      const currentTarget = keyboardAnimationTarget.current;

      const nextHeightValue = Number.parseFloat(nextHeight);
      const nextMinHeightValue = Number.parseFloat(nextMinHeight);

      // Native keyboards emit multiple resize events while a single animation is in progress.
      // The underlying layout is already committed to the final target, so recreating WAAPI here
      // would restart the animation from an intermediate paint on every event. This is especially
      // expensive on Android where `window.resize` and `visualViewport.resize` can be staggered.
      if (
        keyboardAnimation.current &&
        currentTarget &&
        Number.isFinite(nextHeightValue) &&
        Number.isFinite(nextMinHeightValue) &&
        Math.abs(currentTarget.height - nextHeightValue) < 0.5 &&
        Math.abs(currentTarget.minHeight - nextMinHeightValue) < 0.5 &&
        Math.abs(currentTarget.bottom - bottom) < 0.5
      ) {
        if (previousKeyboardTransition) {
          drawer.style.setProperty("--drawer-keyboard-transition", previousKeyboardTransition);
        } else {
          drawer.style.removeProperty("--drawer-keyboard-transition");
        }
        return;
      }

      keyboardAnimation.current?.cancel();
      keyboardAnimation.current = null;
      keyboardAnimationTarget.current = null;

      // An active WAAPI animation can still affect getBoundingClientRect() even after the target
      // styles have been written. Read the final layout only after canceling it; otherwise the
      // next keyboard event uses an in-between height as its target and Android visibly takes two
      // or three steps to settle.
      const nextRect = drawer.getBoundingClientRect();
      const nextTarget = {
        height: nextRect.height,
        minHeight: nextRect.height,
        bottom,
      };

      if (
        !shouldAnimate ||
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
      keyboardAnimationTarget.current = nextTarget;
      animation.play();
      void animation.finished.then(
        () => {
          if (keyboardAnimation.current === animation) {
            keyboardAnimation.current = null;
            keyboardAnimationTarget.current = null;
            animation.cancel();
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

      // Pointer-down and the opening layout effect both run before Android's adjustResize. The
      // focus event itself may arrive afterwards, when a viewport-unit min-height has already
      // collapsed, so keep the larger keyboard-closed measurement as the natural height.
      const drawerHeight = Math.max(
        drawer.getBoundingClientRect().height || 0,
        drawerHeightRef.current,
        getKeyboardClosedViewportMinHeight(drawer),
      );
      if (!Number.isFinite(drawerHeight) || drawerHeight <= 0) return false;

      drawerHeightBeforeKeyboard.current = drawer.style.height;
      drawerMinHeightBeforeKeyboard.current = drawer.style.minHeight;
      initialDrawerHeight.current = drawerHeight;

      // Android's adjustResize can re-evaluate a `vh` min-height before the first viewport event
      // reaches JavaScript. Freeze the keyboard-closed geometry while it is still visible so the
      // subsequent WAAPI animation starts from the sheet the user saw, not from that transient,
      // shrunken layout.
      drawer.style.height = `${drawerHeight}px`;
      drawer.style.minHeight = `${drawerHeight}px`;
      return true;
    }

    function restoreDrawerHeight(previousGeometry?: { height: number; bottom: number } | null) {
      if (!drawerRef.current || drawerHeightBeforeKeyboard.current === null) return;

      drawerHeightRef.current = initialDrawerHeight.current;

      updateDrawerGeometry(
        (drawer) => {
          drawer.style.height = drawerHeightBeforeKeyboard.current ?? "";
          drawer.style.minHeight = drawerMinHeightBeforeKeyboard.current ?? "";
        },
        0,
        previousGeometry,
      );
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
      const reportedVisualViewportHeight = window.visualViewport?.height || window.innerHeight;
      const visualViewportHeight = isIOS()
        ? reportedVisualViewportHeight
        : Math.min(reportedVisualViewportHeight, window.innerHeight);
      const visualViewportOffsetTop = isIOS() ? window.visualViewport?.offsetTop || 0 : 0;
      // During a quick keyboard close-and-reopen Safari can temporarily shrink window.innerHeight
      // to the visual viewport as well. Comparing those two live values would then report no
      // keyboard even though it is visible. Keep the layout viewport measured while the drawer was
      // closed (or before focus) as the stable baseline for this keyboard session.
      const totalHeight = Math.max(layoutViewportHeightBeforeKeyboard.current, window.innerHeight);
      const viewportHeightReduction = totalHeight - visualViewportHeight;
      const layoutViewportHeightReduction = totalHeight - window.innerHeight;
      let keyboardInset = viewportHeightReduction - visualViewportOffsetTop;
      // Android WebView's adjustResize has already shortened the fixed positioner's layout viewport
      // to the area above the keyboard. Applying the stable-baseline inset once more would lift the
      // sheet out of that smaller viewport. iOS can temporarily report the visual viewport through
      // innerHeight without changing the fixed containing block, so keep its stable layout height.
      const currentLayoutViewportHeight = isIOS() ? totalHeight : window.innerHeight;
      let drawerBottom =
        currentLayoutViewportHeight - (visualViewportOffsetTop + visualViewportHeight);
      const wasKeyboardOpen = keyboardIsOpen.current;
      // Android adjustResize can report the closing keyboard in several layout viewport steps.
      // Once a keyboard session has started, keep it active until the viewport is fully restored;
      // otherwise crossing the 60px opening threshold restores authored vh styles too early and
      // produces a second height transition near the end of dismissal.
      const isKeyboardOpen =
        viewportHeightReduction > 60 ||
        (!isIOS() &&
          (layoutViewportHeightReduction > 60 ||
            (wasKeyboardOpen &&
              (viewportHeightReduction > 1 || layoutViewportHeightReduction > 1))));

      const hasFocusedDrawerInput =
        focusedElement instanceof HTMLElement &&
        isInput(focusedElement) &&
        drawerRef.current.contains(focusedElement);

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

      if (isKeyboardOpen) {
        keyboardFocusPending.current = false;
      }

      // focusin is delivered before Android starts adjustResize. The focus RAF below therefore
      // observes a keyboard-closed viewport first. That state must not restore the authored
      // `vh` size: Android will otherwise shrink it once, then this hook re-applies the old pixel
      // height after resize, creating a visible three-step jump. Wait for the real resize or blur.
      if (!isIOS() && keyboardFocusPending.current && hasFocusedDrawerInput && !isKeyboardOpen) {
        return;
      }

      if (!hasFocusedDrawerInput && !wasKeyboardOpen && !isKeyboardOpen) return;

      // Native autofocus can run before the browser reports the keyboard viewport. Keep the
      // provisional FLIP snapshot alive through that gap; blur/close still clears it if no
      // keyboard ever opens (for example when a hardware keyboard is connected).
      if (
        hasFocusedDrawerInput &&
        !isKeyboardOpen &&
        !keyboardEntryConsumed.current &&
        keyboardEntrySnapshot.current
      ) {
        return;
      }

      if (!isKeyboardOpen) {
        cancelKeyboardEntryAnimation();
        keyboardEntrySnapshot.current = null;
        keyboardEntryConsumed.current = true;
        restoreDrawerHeight(keyboardDismissalGeometry.current);
        keyboardDismissalGeometry.current = null;
        return;
      }

      if (!captureDrawerHeight()) {
        scheduleKeyboardReposition();
        return;
      }

      if (keyboardSnapPointsOffset && keyboardActiveSnapPointIndex !== null) {
        const activeSnapPointHeight = keyboardSnapPointsOffset[keyboardActiveSnapPointIndex] || 0;
        keyboardInset += activeSnapPointHeight;
        drawerBottom += activeSnapPointHeight;
      }

      // Derive the height from the natural height and the viewport alone. Measuring the drawer
      // here would be circular: `bottom` animates toward the keyboard position, so a rect read
      // mid-flight describes where the drawer was rather than where it is headed, and folding
      // that back into the height makes every resize compound the last one. Android emits
      // several resizes per keyboard animation, so that compounding inflated the sheet until it
      // filled the screen.
      const naturalHeight = initialDrawerHeight.current;
      // Reserve the larger of the visual viewport margin and the app's top safe area. The latter is
      // measured in layout-viewport coordinates, so subtract an iOS visual viewport pan that has
      // already moved the visible top below it.
      const visualViewportTopInset = Math.max(
        WINDOW_TOP_OFFSET,
        getSafeAreaTop() - visualViewportOffsetTop,
      );
      const availableHeight = Math.max(visualViewportHeight - visualViewportTopInset, 0);
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
        Math.max(drawerBottom, 0),
        undefined,
        // The first keyboard-open geometry is synchronous on every platform. Its visible motion
        // is handled below by the same compositor-only FLIP translate, avoiding an Android-only
        // branch and keeping the real layout inside the safe viewport throughout playback.
        wasKeyboardOpen,
      );
      if (!wasKeyboardOpen) {
        // Measure the focused input against the committed final layout before the temporary
        // translate starts affecting getBoundingClientRect(). A second pass runs when the FLIP
        // finishes to catch focus-driven content that React commits during the animation.
        scrollFocusedInputIntoView();
        if (!animateKeyboardEntry(visualViewportTopInset)) {
          scheduleFocusedInputScroll();
        }
      } else {
        scrollFocusedInputIntoView();
        scheduleFocusedInputScroll();
      }
      if (!isIOS()) {
        // Android can dismiss the IME while leaving the input focused (for example via the system
        // keyboard-down button), so focusout is not guaranteed. Keep the last keyboard-open screen
        // geometry ready for the layout viewport's first expansion event as well.
        keyboardDismissalGeometry.current = {
          height: targetHeight,
          bottom: currentLayoutViewportHeight - Math.max(drawerBottom, 0),
        };
      }
    }

    function onInputPointerDown(event: PointerEvent) {
      const target = event.target;
      if (!repositionInputs || !isOpen || !(target instanceof Element) || !isInput(target)) {
        return;
      }
      if (!drawerRef.current?.contains(target)) return;

      // Android can apply `adjustResize` before it dispatches focusin. Capture the visible,
      // keyboard-closed geometry during pointerdown so a viewport-unit min-height cannot collapse
      // before the keyboard resize handler receives it.
      updateLayoutViewportBaseline();
      captureKeyboardEntrySnapshot(target);
      keyboardFocusPending.current = !isIOS();
      captureDrawerHeight();
    }

    let focusOutSequence = 0;

    function onFocusIn(event: FocusEvent) {
      const target = event.target;
      if (!repositionInputs || !(target instanceof Element) || !isInput(target)) return;
      if (!drawerRef.current?.contains(target)) return;

      focusOutSequence += 1;
      keyboardDismissalPending.current = false;
      keyboardDismissalGeometry.current = null;
      keyboardFocusPending.current = !isIOS();
      updateLayoutViewportBaseline();
      captureKeyboardEntrySnapshot(target);
      if (!captureDrawerHeight()) scheduleKeyboardReposition();

      const visualViewportHeight = window.visualViewport?.height ?? window.innerHeight;
      if (keyboardIsOpen.current || window.innerHeight - visualViewportHeight > 60) {
        onVisualViewportChange();
      }
      scheduleKeyboardReposition();
      scheduleFocusedInputScroll();
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
      focusedInputScrollTarget = null;
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

        keyboardFocusPending.current = false;
        const drawerRect = drawerRef.current?.getBoundingClientRect();
        cancelKeyboardEntryAnimation();
        keyboardEntrySnapshot.current = null;
        keyboardEntryConsumed.current = true;

        if (!isIOS()) {
          if (drawerRect) {
            // Android expands the adjustResize containing block before visualViewport.resize.
            // Preserve the last keyboard-open screen coordinates so the first resize handler can
            // build its WAAPI start keyframe from the visible sheet rather than the already-dropped
            // layout position.
            keyboardDismissalGeometry.current = {
              height: drawerRect.height,
              bottom: drawerRect.bottom,
            };
          }
          return;
        }

        keyboardDismissalPending.current = true;
        restoreDrawerHeight(
          drawerRect ? { height: drawerRect.height, bottom: drawerRect.bottom } : null,
        );
      });
    }

    if (!isOpen) {
      const drawer = drawerRef.current;

      keyboardAnimation.current?.cancel();
      keyboardAnimation.current = null;
      keyboardAnimationTarget.current = null;
      cancelKeyboardEntryAnimation();
      keyboardEntrySnapshot.current = null;
      keyboardEntryConsumed.current = true;

      if (drawer && drawerHeightBeforeKeyboard.current !== null) {
        drawer.style.height = drawerHeightBeforeKeyboard.current;
        drawer.style.minHeight = drawerMinHeightBeforeKeyboard.current ?? "";
        drawer.style.bottom = "0px";
      }

      drawerHeightBeforeKeyboard.current = null;
      drawerMinHeightBeforeKeyboard.current = null;
      initialDrawerHeight.current = 0;
      drawerHeightRef.current = 0;
      updateLayoutViewportBaseline();
      keyboardDismissalPending.current = false;
      keyboardDismissalGeometry.current = null;
      keyboardIsOpen.current = false;
      keyboardFocusPending.current = false;
    }

    let lastViewportResizeSignature: string | null = null;
    function onViewportResize() {
      const visualViewport = window.visualViewport;
      const signature = `${window.innerHeight}:${visualViewport?.height ?? 0}:${visualViewport?.offsetTop ?? 0}`;
      if (signature === lastViewportResizeSignature) {
        return;
      }

      lastViewportResizeSignature = signature;
      onVisualViewportChange();
    }

    function onWindowResize() {
      onViewportResize();
    }

    function onVisualViewportResize() {
      onViewportResize();
    }

    // Android dispatches window.resize before visualViewport.resize while adjustResize restores
    // the layout viewport. Handling the first event closes the one-frame gap where the sheet would
    // otherwise be laid out against the expanded viewport using its keyboard-open pixel height.
    if (!isIOS()) {
      window.addEventListener("resize", onWindowResize);
    }
    window.visualViewport?.addEventListener("resize", onVisualViewportResize);
    window.visualViewport?.addEventListener("scroll", onVisualViewportChange);
    document.addEventListener("pointerdown", onInputPointerDown, true);
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("focusout", onFocusOut, true);

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
      keyboardFocusPending.current = !isIOS();
      if (
        hasKeyboardEntryMotion &&
        keyboardEntryConsumed.current &&
        keyboardEntrySnapshot.current?.target === null
      ) {
        keyboardEntrySnapshot.current.target = focusedElement;
        keyboardEntryConsumed.current = false;
      }
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
      if (focusedInputScrollFrame !== null) {
        window.cancelAnimationFrame(focusedInputScrollFrame);
      }
      keyboardAnimation.current?.cancel();
      keyboardAnimation.current = null;
      keyboardAnimationTarget.current = null;
      cancelKeyboardEntryAnimation();
      if (!isIOS()) {
        window.removeEventListener("resize", onWindowResize);
      }
      window.visualViewport?.removeEventListener("resize", onVisualViewportResize);
      window.visualViewport?.removeEventListener("scroll", onVisualViewportChange);
      document.removeEventListener("pointerdown", onInputPointerDown, true);
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("focusout", onFocusOut, true);
    };
  }, [
    keyboardActiveSnapPointIndex,
    keyboardSnapPointsOffset,
    repositionInputs,
    fixed,
    hasKeyboardEntryMotion,
    isOpen,
  ]);

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
