import type { LynxViewProps } from "../../types";

type ScaleFeedbackMainThreadProps = Pick<
  LynxViewProps,
  | "main-thread:ref"
  | "main-thread:bindlayoutchange"
  | "main-thread:bindtouchstart"
  | "main-thread:bindtouchend"
  | "main-thread:bindtouchcancel"
>;

export function mergeScaleFeedbackProps(
  childProps: LynxViewProps,
  mainThreadProps: ScaleFeedbackMainThreadProps,
): LynxViewProps {
  return {
    ...childProps,
    ...mainThreadProps,
    flatten: false,
  };
}
