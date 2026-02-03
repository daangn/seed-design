import { ariaAttr, buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { useSupports } from "@seed-design/react-supports";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSafeOffset } from "./useSafeOffset";

type SnackbarState = "inactive" | "active" | "persist" | "dismissing";

interface UseSnackbarStateProps {
  /**
   * Whether to pause the toast when interacted with
   * @default true
   */
  pauseOnInteraction?: boolean;
}

export interface CreateSnackbarOptions {
  /**
   * The duration the snackbar will be visible
   * @default 5000
   */
  timeout?: number;
  /**
   * The duration for the snackbar to kept alive before it is removed.
   * Useful for exit transitions.
   * @default 200
   */
  removeDelay?: number;
  /**
   * Function called when the snackbar has been closed and removed
   */
  onClose?: () => void;

  /**
   * The content to render in the snackbar region
   */
  render: () => React.ReactNode;
}

function useSnackbarState({ pauseOnInteraction = true }: UseSnackbarStateProps) {
  const [state, setState] = useState<SnackbarState>("inactive");
  const [queue, setQueue] = useState<CreateSnackbarOptions[]>([]);
  const [currentSnackbar, setCurrentSnackbar] = useState<CreateSnackbarOptions | null>(null);

  const visibleDuration = currentSnackbar?.timeout ?? 5000;
  const removeDelay = currentSnackbar?.removeDelay ?? 200;
  const visible = state === "active" || state === "persist";

  // actions
  const push = useCallback((option: CreateSnackbarOptions) => {
    setQueue((prev) => [...prev, option]);
  }, []);

  const pop = useCallback(() => {
    setQueue(([snackbar, ...rest]) => {
      setCurrentSnackbar(snackbar ?? null);
      return rest;
    });
  }, []);

  const removeCurrentSnackbar = useCallback(() => {
    setCurrentSnackbar(null);
  }, []);

  const invokeOnClose = useCallback(() => {
    if (currentSnackbar?.onClose) {
      currentSnackbar.onClose();
    }
  }, [currentSnackbar]);

  // entry events
  useEffect(() => {
    if (state === "inactive") {
      if (queue.length >= 1) {
        pop();
        setState("active");
      }
    }

    if (state === "active") {
      const timeout = setTimeout(() => {
        setState("dismissing");
      }, visibleDuration);
      return () => clearTimeout(timeout);
    }

    if (state === "dismissing") {
      const timeout = setTimeout(() => {
        setState("inactive");
        invokeOnClose();
        removeCurrentSnackbar();
      }, removeDelay);
      return () => clearTimeout(timeout);
    }
  }, [state, queue, visibleDuration, removeDelay, pop, invokeOnClose, removeCurrentSnackbar]);

  // events
  const events = useMemo(
    () => ({
      push: (option: CreateSnackbarOptions) => {
        push(option);
        if (state === "inactive") {
          pop();
          setState("active");
        }
      },
      pause: () => {
        if (state === "active") {
          if (pauseOnInteraction) {
            setState("persist");
          }
        }
      },
      resume: () => {
        if (state === "persist") {
          setState("active");
        }
      },
      dismiss: () => {
        if (state === "active" || state === "persist") {
          setState("dismissing");
          invokeOnClose();
        }
      },
    }),
    [state, push, pop, invokeOnClose, pauseOnInteraction],
  );

  return useMemo(
    () => ({
      state,
      currentSnackbar,
      visible,
      visibleDuration,
      queue,
      events,
    }),
    [state, currentSnackbar, visible, visibleDuration, queue, events],
  );
}

export interface UseSnackbarProps extends UseSnackbarStateProps {}

export type UseSnackbarReturn = ReturnType<typeof useSnackbar>;

export function useSnackbar(props: UseSnackbarProps) {
  const { state, currentSnackbar, visible, queue, visibleDuration, events } =
    useSnackbarState(props);
  const { overlapTracker, regionRef, regionStyle, safeOffset } = useSafeOffset();
  const isFocusVisibleSupported = useSupports("selector(:focus-visible)");

  return useMemo(
    () => ({
      refs: {
        regionRef,
      },
      visible,
      queue,
      currentSnackbar,
      overlapTracker,
      safeOffset,

      create(options: CreateSnackbarOptions) {
        events.push(options);
      },
      dismiss() {
        events.dismiss();
      },

      regionProps: elementProps({
        tabIndex: -1,
        "aria-live": "polite",
        role: "region",
        style: {
          ...regionStyle,
          "--snackbar-region-offset": `${safeOffset}px`,
          pointerEvents: currentSnackbar ? undefined : "none",
          position: "fixed",
        } as React.CSSProperties,
      }),

      rootProps: elementProps({
        "data-open": dataAttr(visible),
        role: "status",
        "aria-atomic": "true",
        // Hide toasts that are animating out so VoiceOver doesn't announce them.
        "aria-hidden": ariaAttr(state === "dismissing"),
        tabIndex: 0,
        style: {
          position: "relative",
          pointerEvents: "auto",
          "--snackbar-remove-delay": `${currentSnackbar?.removeDelay ?? 0}ms`,
          "--snackbar-duration": `${visibleDuration}ms`,
        } as React.CSSProperties,
        onFocus(event) {
          // if :focus-visible not supported, do not pause on focus
          if (!isFocusVisibleSupported) return;

          // only pause if focus is visible (focused using keyboard) || action label has focus
          if (event.target.matches(":focus-visible")) {
            events.pause();
          }
        },
        onBlur() {
          events.resume();
        },
        onPointerEnter() {
          events.pause();
        },
        onPointerLeave() {
          events.resume();
        },
      }),

      closeButtonProps: buttonProps({
        type: "button",
        onClick() {
          events.dismiss();
        },
      }),
    }),
    [
      visible,
      queue,
      currentSnackbar,
      events,
      visibleDuration,
      state,
      safeOffset,
      regionStyle,
      overlapTracker,
      regionRef,
      isFocusVisibleSupported,
    ],
  );
}
