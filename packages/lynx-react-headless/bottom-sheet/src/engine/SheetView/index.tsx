import type { ReactElement } from "@lynx-js/react";
// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
// Modified by SEED Design: internalized and adapted to the SEED workspace.
import { OverlayView } from "@lynx-js/lynx-ui-overlay";

import { useSheetContext } from "../context";
import type { SheetViewProps } from "../types";

export const SheetView = (props: SheetViewProps): ReactElement | null => {
  const { container, children, className, style, overlayLevel, nativeProps } = props;

  const { mounted, forceMount, enableRTL } = useSheetContext();

  if (!mounted && !forceMount) {
    return null;
  }

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
      {children}
    </OverlayView>
  );
};
