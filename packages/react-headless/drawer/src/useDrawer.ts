import { useControllableState } from "@seed-design/react-use-controllable-state";
import { buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import type React from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { isAndroid, isIOS, isMobileFirefox, isSafari } from "./browser";
import {
  CLOSE_THRESHOLD,
  DRAG_CLASS,
  SCROLL_LOCK_TIMEOUT,
  TRANSITIONS,
  VELOCITY_THRESHOLD,
  WINDOW_TOP_OFFSET,
} from "./constants";
import { dampenValue, getTranslate, isInput, isVertical, reset, set } from "./helpers";
import { usePositionFixed } from "./use-position-fixed";
import { useSnapPoints } from "./use-snap-points";

const KEYBOARD_OPEN_THRESHOLD = 60;
const KEYBOARD_STABILIZATION_THRESHOLD = 60;
// iOS Safari can auto-scroll a visible input before visualViewport settles.
// Briefly hiding the input suppresses that native scroll jump during focus.
const INPUT_FOCUS_GUARD_RESTORE_DELAY = 180;
const INPUT_FOCUS_GUARD_FALLBACK_DELAY = 700;

interface InputFocusGuardState {
  element: HTMLElement;
  opacity: string;
  opacityPriority: string;
  transition: string;
  transitionPriority: string;
  focused: boolean;
  timeoutId: number | null;
  frameId: number | null;
}

function getInputForFocusGuard(target: EventTarget | null, root: HTMLElement) {
  if (!(target instanceof Element)) return null;

  let element: Element | null = target;

  while (element && element !== root) {
    if (isInput(element)) return element as HTMLElement;
    element = element.parentElement;
  }

  return null;
}

interface DrawerReasonToDetailMap {
  // we might add synthetic events later if needed; currently we aim consistency; DismissibleLayer gives us native events
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
  /**
   * When `true` the `body` doesn't get any styles assigned from Drawer
   * @default true
   */
  noBodyStyles?: boolean;
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
  preventScrollRestoration?: boolean;
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
    nested,
    noBodyStyles: noBodyStylesProp,
    direction = "bottom",
    defaultOpen = false,
    snapToSequentialPoint = false,
    preventScrollRestoration = false,
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

      if (!o && !nested) {
        restorePositionSetting();
      }

      setTimeout(() => {
        onAnimationEnd?.(o);
      }, TRANSITIONS.EXIT_DURATION * 1000);

      if (o && !modal) {
        if (typeof window !== "undefined") {
          window.requestAnimationFrame(() => {
            document.body.style.pointerEvents = "auto";
          });
        }
      }

      if (!o) {
        document.body.style.pointerEvents = "auto";
      }
    },
  });

  const [hasBeenOpened, setHasBeenOpened] = useState<boolean>(false);
  const [hasAnimationDone, setHasAnimationDone] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [shouldOverlayAnimate, setShouldOverlayAnimate] = useState<boolean>(false);

  const [isCloseButtonRendered, setIsCloseButtonRendered] = useState<boolean>(false);
  const closeButtonRef = useCallback((node: HTMLButtonElement | null) => {
    setIsCloseButtonRendered(!!node);
  }, []);

  const overlayRef = useRef<HTMLDivElement>(null);
  const openTime = useRef<Date | null>(null);
  const dragStartTime = useRef<Date | null>(null);
  const dragEndTime = useRef<Date | null>(null);
  const lastTimeDragPrevented = useRef<Date | null>(null);
  const isAllowedToDrag = useRef<boolean>(false);
  const pointerStart = useRef(0);
  const keyboardIsOpen = useRef(false);
  const previousDiffFromInitial = useRef(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerHeightRef = useRef(drawerRef.current?.getBoundingClientRect().height || 0);
  const drawerWidthRef = useRef(drawerRef.current?.getBoundingClientRect().width || 0);
  const initialDrawerHeight = useRef(0);
  const visualViewportFrame = useRef<number | null>(null);
  const inputFocusGuard = useRef<InputFocusGuardState | null>(null);

  const noBodyStyles = noBodyStylesProp ?? !(modal && isIOS());

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

  const { restorePositionSetting } = usePositionFixed({
    isOpen,
    modal,
    nested: nested ?? false,
    hasBeenOpened,
    preventScrollRestoration,
    noBodyStyles,
  });

  const restoreKeyboardDrawerLayout = useCallback(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;

    drawer.style.bottom = "0px";

    if (!isMobileFirefox() && !isAndroid()) {
      if (initialDrawerHeight.current) {
        drawer.style.height = `${initialDrawerHeight.current}px`;
      } else {
        drawer.style.removeProperty("height");
      }
    }
  }, []);

  const clearInputFocusGuardTimers = useCallback((guard: InputFocusGuardState) => {
    if (guard.timeoutId !== null) {
      window.clearTimeout(guard.timeoutId);
      guard.timeoutId = null;
    }

    if (guard.frameId !== null) {
      window.cancelAnimationFrame(guard.frameId);
      guard.frameId = null;
    }
  }, []);

  const restoreInputFocusGuard = useCallback(() => {
    const guard = inputFocusGuard.current;
    if (!guard) return;

    clearInputFocusGuardTimers(guard);

    if (guard.opacity) {
      guard.element.style.setProperty("opacity", guard.opacity, guard.opacityPriority);
    } else {
      guard.element.style.removeProperty("opacity");
    }

    if (guard.transition) {
      guard.element.style.setProperty("transition", guard.transition, guard.transitionPriority);
    } else {
      guard.element.style.removeProperty("transition");
    }

    inputFocusGuard.current = null;
  }, [clearInputFocusGuardTimers]);

  const scheduleInputFocusGuardRestore = useCallback(
    (delay = 0) => {
      const guard = inputFocusGuard.current;
      if (!guard) return;

      clearInputFocusGuardTimers(guard);

      if (delay > 0) {
        guard.timeoutId = window.setTimeout(() => {
          restoreInputFocusGuard();
        }, delay);
        return;
      }

      guard.frameId = window.requestAnimationFrame(() => {
        const currentGuard = inputFocusGuard.current;
        if (!currentGuard) return;

        currentGuard.frameId = window.requestAnimationFrame(() => {
          restoreInputFocusGuard();
        });
      });
    },
    [clearInputFocusGuardTimers, restoreInputFocusGuard],
  );

  const applyInputFocusGuard = useCallback(
    (element: HTMLElement) => {
      if (inputFocusGuard.current?.element === element) return;

      restoreInputFocusGuard();

      const guard: InputFocusGuardState = {
        element,
        opacity: element.style.getPropertyValue("opacity"),
        opacityPriority: element.style.getPropertyPriority("opacity"),
        transition: element.style.getPropertyValue("transition"),
        transitionPriority: element.style.getPropertyPriority("transition"),
        focused: false,
        timeoutId: null,
        frameId: null,
      };

      inputFocusGuard.current = guard;
      element.style.setProperty("opacity", "0", "important");
      element.style.setProperty("transition", "none", "important");

      guard.timeoutId = window.setTimeout(() => {
        restoreInputFocusGuard();
      }, INPUT_FOCUS_GUARD_FALLBACK_DELAY);
    },
    [restoreInputFocusGuard],
  );

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
        transition: "none",
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
      transition: `transform ${TRANSITIONS.EXIT_DURATION}s ${TRANSITIONS.CONTENT_EXIT_TIMING_FUNCTION}`,
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
    if (!isOpen || !repositionInputs || !isIOS() || !isSafari()) {
      restoreInputFocusGuard();
      return;
    }

    const drawer = drawerRef.current;
    if (!drawer) return;

    const onInputFocusStart = (event: Event) => {
      const input = getInputForFocusGuard(event.target, drawer);
      if (!input) return;

      applyInputFocusGuard(input);
    };

    const onInputFocus = (event: FocusEvent) => {
      const guard = inputFocusGuard.current;
      if (!guard) return;
      if (event.target instanceof Node && !guard.element.contains(event.target)) return;

      guard.focused = true;
      scheduleInputFocusGuardRestore();
    };

    const onFocusGestureEnd = () => {
      const guard = inputFocusGuard.current;
      if (!guard || guard.focused) return;

      scheduleInputFocusGuardRestore(INPUT_FOCUS_GUARD_RESTORE_DELAY);
    };

    drawer.addEventListener("pointerdown", onInputFocusStart, true);
    drawer.addEventListener("touchstart", onInputFocusStart, true);
    drawer.addEventListener("focusin", onInputFocus, true);
    window.addEventListener("pointerup", onFocusGestureEnd, true);
    window.addEventListener("touchend", onFocusGestureEnd, true);
    window.addEventListener("pointercancel", restoreInputFocusGuard, true);
    window.addEventListener("touchcancel", restoreInputFocusGuard, true);

    return () => {
      drawer.removeEventListener("pointerdown", onInputFocusStart, true);
      drawer.removeEventListener("touchstart", onInputFocusStart, true);
      drawer.removeEventListener("focusin", onInputFocus, true);
      window.removeEventListener("pointerup", onFocusGestureEnd, true);
      window.removeEventListener("touchend", onFocusGestureEnd, true);
      window.removeEventListener("pointercancel", restoreInputFocusGuard, true);
      window.removeEventListener("touchcancel", restoreInputFocusGuard, true);
      restoreInputFocusGuard();
    };
  }, [
    applyInputFocusGuard,
    isOpen,
    repositionInputs,
    restoreInputFocusGuard,
    scheduleInputFocusGuardRestore,
  ]);

  useEffect(() => {
    const visualViewport = window.visualViewport;
    if (!visualViewport) return;

    const cancelScheduledViewportUpdate = () => {
      if (visualViewportFrame.current !== null) {
        window.cancelAnimationFrame(visualViewportFrame.current);
        visualViewportFrame.current = null;
      }
    };

    const syncVisualViewport = (attempt = 0) => {
      visualViewportFrame.current = null;

      const drawer = drawerRef.current;
      if (!drawer || !repositionInputs) return;

      const focusedElement = document.activeElement;
      const isTextInputFocused = focusedElement instanceof HTMLElement && isInput(focusedElement);
      const visualViewportHeight = visualViewport.height || window.innerHeight;
      const visualViewportOffsetTop = visualViewport.offsetTop || 0;
      const totalHeight = window.innerHeight;
      const keyboardInset = Math.max(
        totalHeight - (visualViewportHeight + visualViewportOffsetTop),
        0,
      );

      if (!isTextInputFocused && keyboardInset <= 0 && !keyboardIsOpen.current) {
        previousDiffFromInitial.current = 0;
        restoreKeyboardDrawerLayout();
        return;
      }

      if (
        attempt === 0 &&
        keyboardInset > 0 &&
        Math.abs(previousDiffFromInitial.current - keyboardInset) >
          KEYBOARD_STABILIZATION_THRESHOLD
      ) {
        drawer.style.bottom = `${Math.max(previousDiffFromInitial.current, 0)}px`;
        visualViewportFrame.current = window.requestAnimationFrame(() => syncVisualViewport(1));
        return;
      }

      const nextKeyboardIsOpen =
        (isTextInputFocused && keyboardInset > KEYBOARD_OPEN_THRESHOLD) ||
        (keyboardIsOpen.current && keyboardInset > 0);

      if (!isTextInputFocused && !nextKeyboardIsOpen) {
        keyboardIsOpen.current = false;
        previousDiffFromInitial.current = 0;
        restoreKeyboardDrawerLayout();
        return;
      }

      keyboardIsOpen.current = nextKeyboardIsOpen;

      const drawerRect = drawer.getBoundingClientRect();
      const drawerHeight = drawerRect.height || 0;
      const offsetFromTop = drawerRect.top;
      const isTallEnough = drawerHeight > totalHeight * 0.8;

      if (!initialDrawerHeight.current) {
        initialDrawerHeight.current = drawerHeight;
      }

      if (drawerHeight > visualViewportHeight || nextKeyboardIsOpen) {
        let newDrawerHeight = drawerHeight;

        if (drawerHeight > visualViewportHeight) {
          newDrawerHeight =
            visualViewportHeight - (isTallEnough ? offsetFromTop : WINDOW_TOP_OFFSET);
        }

        if (fixed) {
          drawer.style.height = `${Math.max(initialDrawerHeight.current - keyboardInset, 0)}px`;
        } else {
          drawer.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`;
        }
      } else if (!isMobileFirefox() && !isAndroid()) {
        drawer.style.height = `${initialDrawerHeight.current}px`;
      }

      let bottomOffset = keyboardInset;
      if (snapPoints && snapPoints.length > 0 && snapPointsOffset && activeSnapPointIndex != null) {
        bottomOffset += snapPointsOffset[activeSnapPointIndex] || 0;
      }

      previousDiffFromInitial.current = bottomOffset;
      drawer.style.bottom = `${Math.max(bottomOffset, 0)}px`;
    }

    const scheduleVisualViewportSync = () => {
      cancelScheduledViewportUpdate();
      visualViewportFrame.current = window.requestAnimationFrame(() => syncVisualViewport());
    };

    visualViewport.addEventListener("resize", scheduleVisualViewportSync);
    visualViewport.addEventListener("scroll", scheduleVisualViewportSync);
    document.addEventListener("focusin", scheduleVisualViewportSync, true);
    document.addEventListener("focusout", scheduleVisualViewportSync, true);

    if (isOpen) {
      scheduleVisualViewportSync();
    }

    return () => {
      cancelScheduledViewportUpdate();
      visualViewport.removeEventListener("resize", scheduleVisualViewportSync);
      visualViewport.removeEventListener("scroll", scheduleVisualViewportSync);
      document.removeEventListener("focusin", scheduleVisualViewportSync, true);
      document.removeEventListener("focusout", scheduleVisualViewportSync, true);
    };
  }, [
    activeSnapPointIndex,
    fixed,
    isOpen,
    repositionInputs,
    restoreKeyboardDrawerLayout,
    snapPoints,
    snapPointsOffset,
  ]);

  useEffect(() => {
    if (isOpen) return;

    keyboardIsOpen.current = false;
    previousDiffFromInitial.current = 0;
    initialDrawerHeight.current = 0;
    restoreKeyboardDrawerLayout();
  }, [isOpen, restoreKeyboardDrawerLayout]);

  useEffect(() => {
    if (!modal) {
      window.requestAnimationFrame(() => {
        document.body.style.pointerEvents = "auto";
      });
    }
  }, [modal]);

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
      noBodyStyles,
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
      closeButtonRef,
      isCloseButtonRendered,

      triggerProps: buttonProps({
        ...stateProps,
        onClick: (e) => {
          if (e.defaultPrevented) return;
          setIsOpen(true);
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
        "data-show-close-button": dataAttr(isCloseButtonRendered),
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
      noBodyStyles,
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
      closeButtonRef,
      isCloseButtonRendered,
      stateProps,
    ],
  );
}
