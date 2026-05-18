import { ariaAttr, buttonProps, dataAttr, elementProps } from "@seed-design/dom-utils";
import { useSupports } from "@seed-design/react-supports";
import { useEffect, useMemo, useReducer } from "react";
import { useSafeOffset } from "./useSafeOffset";

type SnackbarState = "inactive" | "active" | "persist" | "dismissing";

interface UseSnackbarStateProps {
  /**
   * Whether to pause the toast when interacted with
   * @default true
   */
  pauseOnInteraction?: boolean;

  /**
   * How to handle multiple snackbars.
   * - `"immediate"`: New snackbar replaces the current one instantly.
   * - `"queued"`: New snackbar waits in a queue until the current one is dismissed.
   * @default "immediate"
   */
  strategy?: "immediate" | "queued";
}

export interface CreateSnackbarOptions {
  /**
   * The duration the snackbar will be visible
   * @default 4000
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

  /**
   * Override the provider-level strategy for this specific snackbar.
   * - `"immediate"`: Replace the current snackbar instantly.
   * - `"queued"`: Wait in the queue until the current one is dismissed.
   */
  strategy?: "immediate" | "queued";
}

interface ReducerState {
  state: SnackbarState;
  queue: CreateSnackbarOptions[];
  currentSnackbar: CreateSnackbarOptions | null;
}

type ReducerAction =
  | { type: "PUSH"; option: CreateSnackbarOptions; strategy: "immediate" | "queued" }
  | { type: "ACTIVATE_NEXT" }
  | { type: "PAUSE"; pauseOnInteraction: boolean }
  | { type: "RESUME" }
  | { type: "DISMISS" }
  | { type: "REMOVE" };

const initialState: ReducerState = {
  state: "inactive",
  queue: [],
  currentSnackbar: null,
};

function reducer(s: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case "PUSH": {
      const { option, strategy } = action;
      if (strategy === "immediate") {
        switch (s.state) {
          case "inactive":
            return { state: "active", currentSnackbar: option, queue: [] };
          case "dismissing":
            return { ...s, queue: [option] };
          default:
            return { ...s, state: "dismissing", queue: [option] };
        }
      }
      if (s.state === "inactive") {
        return { state: "active", currentSnackbar: option, queue: [] };
      }
      return { ...s, queue: [...s.queue, option] };
    }
    case "ACTIVATE_NEXT": {
      if (s.state !== "inactive" || s.queue.length === 0) return s;
      const [first, ...rest] = s.queue;
      return { state: "active", currentSnackbar: first, queue: rest };
    }
    case "PAUSE":
      return action.pauseOnInteraction && s.state === "active" ? { ...s, state: "persist" } : s;
    case "RESUME":
      return s.state === "persist" ? { ...s, state: "active" } : s;
    case "DISMISS":
      return s.state === "active" || s.state === "persist" ? { ...s, state: "dismissing" } : s;
    case "REMOVE":
      return { ...s, state: "inactive", currentSnackbar: null };
  }
}

function useSnackbarState({
  pauseOnInteraction = true,
  strategy = "immediate",
}: UseSnackbarStateProps) {
  const [{ state, queue, currentSnackbar }, dispatch] = useReducer(reducer, initialState);

  const visibleDuration = currentSnackbar?.timeout ?? 4000;
  const removeDelay = currentSnackbar?.removeDelay ?? 200;
  const visible = state === "active" || state === "persist";

  useEffect(() => {
    switch (state) {
      case "inactive": {
        if (queue.length >= 1) dispatch({ type: "ACTIVATE_NEXT" });
        break;
      }
      case "active": {
        const timeout = setTimeout(() => dispatch({ type: "DISMISS" }), visibleDuration);
        return () => clearTimeout(timeout);
      }
      case "dismissing": {
        const timeout = setTimeout(() => {
          currentSnackbar?.onClose?.();
          dispatch({ type: "REMOVE" });
        }, removeDelay);
        return () => clearTimeout(timeout);
      }
    }
  }, [state, queue.length, currentSnackbar, visibleDuration, removeDelay]);

  const events = useMemo(
    () => ({
      push: (option: CreateSnackbarOptions) => {
        dispatch({ type: "PUSH", option, strategy: option.strategy ?? strategy });
      },
      pause: () => dispatch({ type: "PAUSE", pauseOnInteraction }),
      resume: () => dispatch({ type: "RESUME" }),
      dismiss: () => dispatch({ type: "DISMISS" }),
    }),
    [strategy, pauseOnInteraction],
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
