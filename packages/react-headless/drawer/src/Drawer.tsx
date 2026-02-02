"use client";

import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import { FocusScope } from "@radix-ui/react-focus-scope";
import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { dataAttr, mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Presence } from "./private/Presence";
import type { DrawerDirection } from "./types";
import { useDrawer, type UseDrawerProps } from "./useDrawer";
import { DrawerProvider, useDrawerContext } from "./useDrawerContext";

export interface DrawerRootProps extends UseDrawerProps {
  children?: React.ReactNode;
}

export const DrawerRoot = (props: DrawerRootProps) => {
  const { children } = props;
  const api = useDrawer(props);
  return <DrawerProvider value={api}>{children}</DrawerProvider>;
};

export interface DrawerTriggerProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const DrawerTrigger = forwardRef<HTMLButtonElement, DrawerTriggerProps>((props, ref) => {
  const api = useDrawerContext();
  return <Primitive.button ref={ref} {...mergeProps(api.triggerProps, props)} />;
});
DrawerTrigger.displayName = "DrawerTrigger";

export interface DrawerPositionerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const DrawerPositioner = forwardRef<HTMLDivElement, DrawerPositionerProps>((props, ref) => {
  const api = useDrawerContext();
  return (
    <Primitive.div
      ref={ref}
      {...props}
      style={{ pointerEvents: api.isOpen ? undefined : "none", ...props.style }}
    />
  );
});
DrawerPositioner.displayName = "DrawerPositioner";

export interface DrawerBackdropProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const DrawerBackdrop = forwardRef<HTMLDivElement, DrawerBackdropProps>((props, ref) => {
  const {
    overlayRef,
    onRelease,
    modal,
    snapPoints,
    isOpen,
    shouldFade,
    shouldOverlayAnimate,
    hasAnimationDone,
    backdropProps,
  } = useDrawerContext();
  const composedRef = useComposedRefs(ref, overlayRef);
  const hasSnapPoints = snapPoints && snapPoints.length > 0;
  const onMouseUp = useCallbackRef((event: React.PointerEvent<HTMLDivElement>) => onRelease(event));

  if (!modal) {
    return null;
  }

  return (
    <Presence present={isOpen} unmountOnExit lazyMount={false}>
      <Primitive.div
        ref={composedRef}
        onMouseUp={onMouseUp}
        data-snap-points={isOpen && hasSnapPoints ? "true" : "false"}
        data-snap-points-overlay={isOpen && shouldFade ? "true" : "false"}
        data-should-overlay-animate={shouldOverlayAnimate ? "true" : "false"}
        data-animation-done={hasAnimationDone ? "true" : "false"}
        {...mergeProps(backdropProps, props)}
      />
    </Presence>
  );
});
DrawerBackdrop.displayName = "DrawerBackdrop";

export interface DrawerContentProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>((props, ref) => {
  const { style, ...restProps } = props;
  const {
    drawerRef,
    onPress,
    onRelease,
    onDrag,
    keyboardIsOpen,
    snapPointsOffset,
    activeSnapPointIndex,
    modal,
    isOpen,
    direction,
    snapPoints,
    container,
    handleOnly,
    autoFocus,
    closeDrawer,
    closeOnInteractOutside,
    closeOnEscape,
    dismissible,
    hasAnimationDone,
    contentProps,
  } = useDrawerContext();
  // Needed to use transition instead of animations
  const [delayedSnapPoints, setDelayedSnapPoints] = useState(false);
  const composedRef = useComposedRefs(ref, drawerRef);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastKnownPointerEventRef = useRef<React.PointerEvent<HTMLDivElement> | null>(null);
  const wasBeyondThePointRef = useRef(false);
  const hasSnapPoints = snapPoints && snapPoints.length > 0;

  const isDeltaInDirection = (
    delta: { x: number; y: number },
    direction: DrawerDirection,
    threshold = 0,
  ) => {
    if (wasBeyondThePointRef.current) return true;

    const deltaY = Math.abs(delta.y);
    const deltaX = Math.abs(delta.x);
    const isDeltaX = deltaX > deltaY;
    const dFactor = ["bottom", "right"].includes(direction) ? 1 : -1;

    if (direction === "left" || direction === "right") {
      const isReverseDirection = delta.x * dFactor < 0;
      if (!isReverseDirection && deltaX >= 0 && deltaX <= threshold) {
        return isDeltaX;
      }
    } else {
      const isReverseDirection = delta.y * dFactor < 0;
      if (!isReverseDirection && deltaY >= 0 && deltaY <= threshold) {
        return !isDeltaX;
      }
    }

    wasBeyondThePointRef.current = true;
    return true;
  };

  useEffect(() => {
    if (hasSnapPoints) {
      window.requestAnimationFrame(() => {
        setDelayedSnapPoints(true);
      });
    }
  }, [hasSnapPoints]);

  function handleOnPointerUp(event: React.PointerEvent<HTMLDivElement> | null) {
    pointerStartRef.current = null;
    wasBeyondThePointRef.current = false;
    onRelease(event);
  }

  return (
    <Presence present={isOpen} unmountOnExit lazyMount={false}>
      <FocusScope asChild loop trapped={isOpen && modal && autoFocus}>
        <DismissableLayer
          data-delayed-snap-points={delayedSnapPoints ? "true" : "false"}
          data-drawer-direction={direction}
          data-animation-done={hasAnimationDone ? "true" : "false"}
          data-drawer=""
          data-snap-points={isOpen && hasSnapPoints ? "true" : "false"}
          data-custom-container={container ? "true" : "false"}
          {...mergeProps(contentProps, restProps)}
          ref={composedRef}
          style={
            snapPointsOffset && snapPointsOffset.length > 0
              ? ({
                  "--snap-point-height": `${snapPointsOffset[activeSnapPointIndex ?? 0]!}px`,
                  ...style,
                } as React.CSSProperties)
              : (style ?? {})
          }
          onPointerDown={(event) => {
            if (handleOnly) return;
            restProps.onPointerDown?.(event);
            pointerStartRef.current = { x: event.pageX, y: event.pageY };
            onPress(event);
          }}
          // TODO: onOpenAutoFocus
          onPointerDownOutside={(e) => {
            if (!modal || e.defaultPrevented) {
              e.preventDefault();
              return;
            }
            if (keyboardIsOpen.current) {
              keyboardIsOpen.current = false;
            }
          }}
          onFocusOutside={(e) => {
            // Always prevent focusOutside to avoid conflicts when focus moves between modals
            e.preventDefault();
          }}
          onPointerMove={(event) => {
            lastKnownPointerEventRef.current = event;
            if (handleOnly) return;
            restProps.onPointerMove?.(event);
            if (!pointerStartRef.current) return;
            const yPosition = event.pageY - pointerStartRef.current.y;
            const xPosition = event.pageX - pointerStartRef.current.x;

            const swipeStartThreshold = event.pointerType === "touch" ? 10 : 2;
            const delta = { x: xPosition, y: yPosition };

            const isAllowedToSwipe = isDeltaInDirection(delta, direction, swipeStartThreshold);
            if (isAllowedToSwipe) onDrag(event);
            else if (
              Math.abs(xPosition) > swipeStartThreshold ||
              Math.abs(yPosition) > swipeStartThreshold
            ) {
              pointerStartRef.current = null;
            }
          }}
          onPointerUp={(event) => {
            restProps.onPointerUp?.(event);
            pointerStartRef.current = null;
            wasBeyondThePointRef.current = false;
            onRelease(event);
          }}
          onPointerOut={(event) => {
            restProps.onPointerOut?.(event);
            handleOnPointerUp(lastKnownPointerEventRef.current);
          }}
          onContextMenu={(event) => {
            restProps.onContextMenu?.(event);
            if (lastKnownPointerEventRef.current) {
              handleOnPointerUp(lastKnownPointerEventRef.current);
            }
          }}
          onInteractOutside={(event) => {
            if (!closeOnInteractOutside) {
              event.preventDefault();
              return;
            }
            if (dismissible && !event.defaultPrevented) {
              closeDrawer(false);
            }
          }}
          onEscapeKeyDown={(event) => {
            if (!closeOnEscape) {
              event.preventDefault();
              return;
            }
            if (dismissible) {
              closeDrawer(false);
            }
          }}
        />
      </FocusScope>
    </Presence>
  );
});
DrawerContent.displayName = "DrawerContent";

export interface DrawerTitleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLHeadingElement> {}

export const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>((props, ref) => {
  const api = useDrawerContext();
  return <Primitive.h2 ref={ref} {...mergeProps(api.titleProps, props)} />;
});
DrawerTitle.displayName = "DrawerTitle";

export interface DrawerDescriptionProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLParagraphElement> {}

export const DrawerDescription = forwardRef<HTMLParagraphElement, DrawerDescriptionProps>(
  (props, ref) => {
    const api = useDrawerContext();
    return <Primitive.p ref={ref} {...mergeProps(api.descriptionProps, props)} />;
  },
);
DrawerDescription.displayName = "DrawerDescription";

export interface DrawerHeaderProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>((props, ref) => {
  const { isCloseButtonRendered } = useDrawerContext();
  return (
    <Primitive.div ref={ref} data-show-close-button={dataAttr(isCloseButtonRendered)} {...props} />
  );
});
DrawerHeader.displayName = "DrawerHeader";

export interface DrawerCloseButtonProps
  extends PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const DrawerCloseButton = forwardRef<HTMLButtonElement, DrawerCloseButtonProps>(
  (props, ref) => {
    const { closeButtonRef, setIsOpen } = useDrawerContext();
    const composedRef = useComposedRefs(ref, closeButtonRef);
    return (
      <Primitive.button
        ref={composedRef}
        {...props}
        onClick={(e) => {
          props.onClick?.(e);
          if (e.defaultPrevented) return;
          setIsOpen(false);
        }}
      />
    );
  },
);

export interface DrawerHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  preventCycle?: boolean;
}

const LONG_HANDLE_PRESS_TIMEOUT = 250;
const DOUBLE_TAP_TIMEOUT = 120;

export const DrawerHandle = forwardRef<HTMLDivElement, DrawerHandleProps>((props, ref) => {
  const { preventCycle = false, children, ...rest } = props;
  const {
    closeDrawer,
    isDragging,
    snapPoints,
    activeSnapPoint,
    setActiveSnapPoint,
    dismissible,
    handleOnly,
    isOpen,
    onPress,
    onDrag,
    onRelease,
  } = useDrawerContext();

  const closeTimeoutIdRef = useRef<number | null>(null);
  const shouldCancelInteractionRef = useRef(false);

  function handleStartCycle() {
    // Stop if this is the second click of a double click
    if (shouldCancelInteractionRef.current) {
      handleCancelInteraction();
      return;
    }
    window.setTimeout(() => {
      handleCycleSnapPoints();
    }, DOUBLE_TAP_TIMEOUT);
  }

  function handleCycleSnapPoints() {
    // Prevent accidental taps while resizing drawer
    if (isDragging || preventCycle || shouldCancelInteractionRef.current) {
      handleCancelInteraction();
      return;
    }
    // Make sure to clear the timeout id if the user releases the handle before the cancel timeout
    handleCancelInteraction();

    if (!snapPoints || snapPoints.length === 0) {
      if (!dismissible) {
        closeDrawer();
      }
      return;
    }

    const isLastSnapPoint = activeSnapPoint === snapPoints[snapPoints.length - 1];

    if (isLastSnapPoint && dismissible) {
      closeDrawer();
      return;
    }

    const currentSnapIndex = snapPoints.findIndex((point) => point === activeSnapPoint);
    if (currentSnapIndex === -1) return; // activeSnapPoint not found in snapPoints
    const nextSnapPoint = snapPoints[currentSnapIndex + 1];
    setActiveSnapPoint(nextSnapPoint);
  }

  function handleStartInteraction() {
    closeTimeoutIdRef.current = window.setTimeout(() => {
      // Cancel click interaction on a long press
      shouldCancelInteractionRef.current = true;
    }, LONG_HANDLE_PRESS_TIMEOUT);
  }

  function handleCancelInteraction() {
    if (closeTimeoutIdRef.current) {
      window.clearTimeout(closeTimeoutIdRef.current);
    }
    shouldCancelInteractionRef.current = false;
  }

  return (
    <Primitive.div
      ref={ref}
      onClick={handleStartCycle}
      onPointerCancel={handleCancelInteraction}
      onPointerDown={(e) => {
        if (handleOnly) onPress(e);
        handleStartInteraction();
      }}
      onPointerMove={(e) => {
        if (handleOnly) onDrag(e);
      }}
      onPointerUp={(e) => {
        if (handleOnly) onRelease(e);
        handleCancelInteraction();
      }}
      data-drawer-visible={isOpen ? "true" : "false"}
      data-handle=""
      aria-hidden="true"
      {...rest}
    >
      {children}
    </Primitive.div>
  );
});
DrawerHandle.displayName = "DrawerHandle";
