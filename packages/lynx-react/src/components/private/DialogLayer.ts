import { useCallback, useState } from "@lynx-js/react";
import type { DialogPositionerProps } from "@seed-design/lynx-react-dialog";
import type { LayoutChangeEvent } from "@lynx-js/types";

import { mergeProps } from "../../utils/merge-props";

type DialogViewProps = NonNullable<DialogPositionerProps["dialogViewProps"]>;

/**
 * Measures the dialog layer so the content's height cap follows it: `vh` is relative to the
 * LynxView, which differs from a `container` layer or a LynxView embedded at a fixed height. The
 * native props land on the layer view without `container` and on the `<overlay>` with it; both
 * span the layer. Until the first measurement the recipe falls back to `100vh`, the same length in
 * a full-screen LynxView.
 */
export function useDialogLayerHeight(dialogViewProps: DialogViewProps | undefined): {
  dialogViewProps: DialogViewProps;
  layerStyle: Record<"--dialog-layer-height", string> | undefined;
} {
  const [layerHeight, setLayerHeight] = useState<number>();
  const handleLayoutChange = useCallback((event: LayoutChangeEvent) => {
    "background only";
    const { height } = event.detail;
    // A hidden layer reports 0; keep the last height.
    if (Number.isFinite(height) && height > 0) setLayerHeight(height);
  }, []);

  return {
    dialogViewProps: mergeProps(dialogViewProps ?? {}, {
      bindlayoutchange: handleLayoutChange,
    }) as DialogViewProps,
    layerStyle:
      layerHeight === undefined ? undefined : { "--dialog-layer-height": `${layerHeight}px` },
  };
}
