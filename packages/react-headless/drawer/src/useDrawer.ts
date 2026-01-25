import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isIOS, isMobileFirefox } from "./browser";
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
  onOpenChange?: (open: boolean) => void;
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
    noBodyStyles = true,
    direction = "bottom",
    defaultOpen = false,
    snapToSequentialPoint = false,
    preventScrollRestoration = false,
    repositionInputs = true,
    onAnimationEnd,
    container,
    autoFocus = false,
    closeOnInteractOutside = true,
    closeOnEscape = true,
  } = props;

  const [isOpen = false, setIsOpen] = useControllableState({
    defaultProp: defaultOpen,
    prop: openProp,
    onChange: (o: boolean) => {
      onOpenChange?.(o);

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
  const [hasEntered, setHasEntered] = useState<boolean>(false);
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
  const previousDiffFromInitial = useRef(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerHeightRef = useRef(drawerRef.current?.getBoundingClientRect().height || 0);
  const drawerWidthRef = useRef(drawerRef.current?.getBoundingClientRect().width || 0);
  const initialDrawerHeight = useRef(0);

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
    (fromWithin?: boolean) => {
      cancelDrag();
      onClose?.();

      if (!fromWithin) {
        setIsOpen(false);
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
      closeDrawer();
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
      closeDrawer();
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
    function onVisualViewportChange() {
      if (!drawerRef.current || !repositionInputs) return;

      const focusedElement = document.activeElement as HTMLElement;
      if (isInput(focusedElement) || keyboardIsOpen.current) {
        const visualViewportHeight = window.visualViewport?.height || 0;
        const totalHeight = window.innerHeight;
        let diffFromInitial = totalHeight - visualViewportHeight;
        const drawerHeight = drawerRef.current.getBoundingClientRect().height || 0;
        const isTallEnough = drawerHeight > totalHeight * 0.8;

        if (!initialDrawerHeight.current) {
          initialDrawerHeight.current = drawerHeight;
        }
        const offsetFromTop = drawerRef.current.getBoundingClientRect().top;

        if (Math.abs(previousDiffFromInitial.current - diffFromInitial) > 60) {
          keyboardIsOpen.current = !keyboardIsOpen.current;
        }

        if (snapPoints && snapPoints.length > 0 && snapPointsOffset && activeSnapPointIndex) {
          const activeSnapPointHeight = snapPointsOffset[activeSnapPointIndex] || 0;
          diffFromInitial += activeSnapPointHeight;
        }
        previousDiffFromInitial.current = diffFromInitial;

        if (drawerHeight > visualViewportHeight || keyboardIsOpen.current) {
          const height = drawerRef.current.getBoundingClientRect().height;
          let newDrawerHeight = height;

          if (height > visualViewportHeight) {
            newDrawerHeight =
              visualViewportHeight - (isTallEnough ? offsetFromTop : WINDOW_TOP_OFFSET);
          }

          if (fixed) {
            drawerRef.current.style.height = `${height - Math.max(diffFromInitial, 0)}px`;
          } else {
            drawerRef.current.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`;
          }
        } else if (!isMobileFirefox()) {
          drawerRef.current.style.height = `${initialDrawerHeight.current}px`;
        }

        if (snapPoints && snapPoints.length > 0 && !keyboardIsOpen.current) {
          drawerRef.current.style.bottom = "0px";
        } else {
          drawerRef.current.style.bottom = `${Math.max(diffFromInitial, 0)}px`;
        }
      }
    }

    window.visualViewport?.addEventListener("resize", onVisualViewportChange);
    return () => window.visualViewport?.removeEventListener("resize", onVisualViewportChange);
  }, [activeSnapPointIndex, snapPoints, snapPointsOffset, repositionInputs, fixed]);

  useEffect(() => {
    if (!modal) {
      window.requestAnimationFrame(() => {
        document.body.style.pointerEvents = "auto";
      });
    }
  }, [modal]);

  useEffect(() => {
    if (isOpen) {
      setHasBeenOpened(true);
      setHasEntered(false);
      const timeoutId = setTimeout(() => {
        setHasEntered(true);
      }, TRANSITIONS.ENTER_DURATION * 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

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
      hasEntered,
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
      hasEntered,
    ],
  );
}
