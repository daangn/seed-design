import type { ReactElement } from "@lynx-js/react";
// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
// Modified by SEED Design: internalized and adapted to the SEED workspace; measure the layer.
import { useEffect } from "@lynx-js/react";
import { OverlayView } from "@lynx-js/lynx-ui-overlay";
import type { IntrinsicElements, LayoutChangeEvent } from "@lynx-js/types";

import { useSheetContext } from "../context";
import type { SheetLayerSize } from "../context";
import type { SheetViewProps } from "../types";

// 크기가 있는 투명 view는 iOS에서 아래 scroll-view의 native pan을 막으므로, 한 축만 레이어를 채우는 0 두께 선으로 잰다.
const HEIGHT_PROBE_STYLE: React.CSSProperties = {
  position: "absolute",
  top: "0px",
  bottom: "0px",
  left: "0px",
  width: "0px",
};
const WIDTH_PROBE_STYLE: React.CSSProperties = {
  position: "absolute",
  top: "0px",
  left: "0px",
  right: "0px",
  height: "0px",
};

export const SheetView = (props: SheetViewProps): ReactElement | null => {
  const { mounted, forceMount } = useSheetContext();

  if (!mounted && !forceMount) {
    return null;
  }

  return <MountedSheetView {...props} />;
};

function MountedSheetView(props: SheetViewProps): ReactElement {
  const { container, children, className, style, overlayLevel, nativeProps } = props;
  const { enableRTL, setLayerSize } = useSheetContext();

  // 닫혀 unmount된 동안 바뀐 크기(회전 등)로 다음 진입을 계산하지 않도록 측정값을 지운다.
  useEffect(
    () => () => {
      setLayerSize("width", undefined);
      setLayerSize("height", undefined);
    },
    [setLayerSize],
  );

  const getProbeHandlers = (
    axis: keyof SheetLayerSize,
  ): Pick<IntrinsicElements["view"], "bindlayoutchange"> => ({
    bindlayoutchange: (event: LayoutChangeEvent) => {
      "background only";
      const size = event.detail[axis];
      // view 모드에서 레이어를 `display: none`으로 숨기면 0으로 오므로 마지막 측정값을 유지한다.
      if (!Number.isFinite(size) || size <= 0) return;
      setLayerSize(axis, size);
    },
  });

  return (
    <OverlayView
      container={container}
      className={className}
      style={{
        direction: enableRTL ? "rtl" : "ltr",
        ...style,
        position: container ? "relative" : "fixed",
      }}
      overlayLevel={overlayLevel}
      overlayViewProps={nativeProps}
    >
      <view style={HEIGHT_PROBE_STYLE} {...getProbeHandlers("height")} />
      <view style={WIDTH_PROBE_STYLE} {...getProbeHandlers("width")} />
      {children}
    </OverlayView>
  );
}
