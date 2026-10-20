import type { ReactElement } from "@lynx-js/react";
// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
// Modified by SEED Design: adapt style typing and finish canceled drags.

import { useSheetDragContext } from "../context";
import type { SheetHandleProps } from "../types";

export function SheetHandle(props: SheetHandleProps): ReactElement {
  const { className, style, children, ...rest } = props;
  const { dragHandlers } = useSheetDragContext();

  return (
    <view
      className={className}
      style={style as React.CSSProperties}
      {...rest}
      event-through={false}
      main-thread:bindtouchstart={dragHandlers.handleTouchStartMT}
      main-thread:bindtouchmove={dragHandlers.handleTouchMoveMT}
      main-thread:bindtouchend={dragHandlers.handleTouchEndMT}
      main-thread:bindtouchcancel={dragHandlers.handleTouchEndMT}
    >
      {children}
    </view>
  );
}
