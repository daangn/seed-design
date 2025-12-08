"use client";

import { useComposedRefs } from "@radix-ui/react-compose-refs";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { dataAttr } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef, useEffect, useRef, useState } from "react";
import type { DrawerDirection } from "./types";
import { useDrawer, type UseDrawerProps } from "./useDrawer";
import { DrawerProvider, useDrawerContext } from "./useDrawerContext";

export interface DrawerRootProps extends UseDrawerProps {
  children?: React.ReactNode;
}

export const DrawerRoot = (props: DrawerRootProps) => {
  const { children, defaultOpen, dismissible, modal } = props;
  const api = useDrawer(props);
  return (
    <DialogPrimitive.Root
      defaultOpen={defaultOpen}
      open={api.isOpen}
      onOpenChange={(open) => {
        if (!dismissible && !open) return;
        if (open) {
          api.setHasBeenOpened(true);
        } else {
          api.closeDrawer(true);
        }

        api.setIsOpen(open);
      }}
      modal={modal}
    >
      <DrawerProvider value={api}>{children}</DrawerProvider>
    </DialogPrimitive.Root>
  );
};

export interface DrawerTriggerProps extends DialogPrimitive.DialogTriggerProps {}

export const DrawerTrigger = DialogPrimitive.Trigger;

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

export interface DrawerBackdropProps
  extends DialogPrimitive.DialogOverlayProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const DrawerBackdrop = forwardRef<HTMLDivElement, DrawerBackdropProps>((props, ref) => {
  const {
    overlayRef,
    onRelease,
    modal,
    snapPoints,
    isOpen,
    shouldFade,
    skipAnimation,
    shouldOverlayAnimate,
  } = useDrawerContext();
  const composedRef = useComposedRefs(ref, overlayRef);
  const hasSnapPoints = snapPoints && snapPoints.length > 0;
  const onMouseUp = useCallbackRef((event: React.PointerEvent<HTMLDivElement>) => onRelease(event));

  // Overlay is the component that is locking scroll, removing it will unlock the scroll without having to dig into Radix's Dialog library
  if (!modal) {
    return null;
  }

  return (
    <DialogPrimitive.Overlay
      ref={composedRef}
      onMouseUp={onMouseUp}
      data-snap-points={isOpen && hasSnapPoints ? "true" : "false"}
      data-snap-points-overlay={isOpen && shouldFade ? "true" : "false"}
      data-skip-animation={dataAttr(skipAnimation)}
      data-should-overlay-animate={shouldOverlayAnimate ? "true" : "false"}
      data-open={dataAttr(isOpen)}
      {...props}
    />
  );
});
DrawerBackdrop.displayName = "DrawerBackdrop";

export interface DrawerContentProps
  extends DialogPrimitive.DialogContentProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>((props, ref) => {
  const { onPointerDownOutside, style, onOpenAutoFocus, ...restProps } = props;
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
    skipAnimation,
    autoFocus,
    closeDrawer,
    closeOnInteractOutside,
    closeOnEscape,
    dismissible,
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
  }, []);

  function handleOnPointerUp(event: React.PointerEvent<HTMLDivElement> | null) {
    pointerStartRef.current = null;
    wasBeyondThePointRef.current = false;
    onRelease(event);
  }

  return (
    <DialogPrimitive.Content
      data-delayed-snap-points={delayedSnapPoints ? "true" : "false"}
      data-drawer-direction={direction}
      data-open={dataAttr(isOpen)}
      data-drawer=""
      data-snap-points={isOpen && hasSnapPoints ? "true" : "false"}
      data-custom-container={container ? "true" : "false"}
      data-skip-animation={dataAttr(skipAnimation)}
      {...restProps}
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
      onOpenAutoFocus={(e) => {
        onOpenAutoFocus?.(e);

        if (!autoFocus) {
          e.preventDefault();
        }
      }}
      onPointerDownOutside={(e) => {
        onPointerDownOutside?.(e);

        if (!modal || e.defaultPrevented) {
          e.preventDefault();
          return;
        }

        if (keyboardIsOpen.current) {
          keyboardIsOpen.current = false;
        }
      }}
      onFocusOutside={(e) => {
        if (!modal) {
          e.preventDefault();
          return;
        }
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
      onInteractOutside={(e) => {
        if (dismissible && closeOnInteractOutside) {
          closeDrawer();
        }
        props.onInteractOutside?.(e);
      }}
      onEscapeKeyDown={(e) => {
        if (dismissible && closeOnEscape) {
          closeDrawer();
        }
        props.onEscapeKeyDown?.(e);
      }}
    />
  );
});
DrawerContent.displayName = "DrawerContent";

export interface DrawerTitleProps extends DialogPrimitive.DialogTitleProps {}

export const DrawerTitle = DialogPrimitive.Title;

export interface DrawerDescriptionProps extends DialogPrimitive.DialogDescriptionProps {}

export const DrawerDescription = DialogPrimitive.Description;

export interface DrawerCloseButtonProps extends DialogPrimitive.DialogCloseProps {}

export const DrawerCloseButton = forwardRef<HTMLButtonElement, DrawerCloseButtonProps>(
  (props, ref) => {
    const api = useDrawerContext();
    return (
      <Primitive.button
        ref={ref}
        {...props}
        onClick={(e) => {
          props.onClick?.(e);
          if (e.defaultPrevented) return;
          api.setIsOpen(false);
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
