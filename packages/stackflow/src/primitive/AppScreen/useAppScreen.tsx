import { dataAttr, elementProps } from "@seed-design/dom-utils";
import { useNullableActivity } from "@stackflow/react-ui-core";
import { useMemo } from "react";
import { type UseSwipeBackProps, useSwipeBack } from "../GlobalInteraction/useSwipeBack";
import { useActivityZIndexBase } from "../../hooks";

export interface UseAppScreenProps extends UseSwipeBackProps {}

export type UseAppScreenReturn = ReturnType<typeof useAppScreen>;

export function useAppScreen(props: UseAppScreenProps) {
  const activity = useNullableActivity();

  const transitionState = activity?.transitionState ?? "enter-done";

  const { activityProps, layerProps, edgeProps } = useSwipeBack(props);

  const zIndexBase = useActivityZIndexBase();
  const zIndexStyle = useMemo(
    () =>
      ({
        "--z-index-base": zIndexBase.toString(),
      }) as React.CSSProperties,
    [zIndexBase],
  );

  const stateProps = useMemo(
    () => ({
      "data-activity-is-top": dataAttr(activity?.isTop),
      "data-activity-is-active": dataAttr(activity?.isActive),
      "data-transition-state": transitionState,
    }),
    [transitionState, activity?.isActive, activity?.isTop],
  ) as React.HTMLAttributes<HTMLElement>;

  return useMemo(
    () => ({
      activity,
      stateProps,
      activityProps: elementProps({
        "data-part": "activity",
        "data-activity-type": "full-screen",
        ...activityProps,
        ...stateProps,
        "data-activity-id": activity?.id,
        style: zIndexStyle,
        // FIXME: @stackflow/react should prevent activity.id hydration mismatch; this is temporal fix.
        suppressHydrationWarning: true,
      }),
      dimProps: elementProps({
        "data-part": "dim",
        ...stateProps,
      }),
      layerProps: elementProps({
        "data-part": "layer",
        ...stateProps,
        ...layerProps,
      }),
      edgeProps: elementProps({
        "data-part": "edge",
        "aria-hidden": true,
        tabIndex: -1,
        ...edgeProps,
        ...stateProps,
      }),
    }),
    [activity, zIndexStyle, stateProps, activityProps, edgeProps, layerProps],
  );
}
