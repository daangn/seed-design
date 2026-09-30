import clsx from "clsx";
import * as React from "@lynx-js/react";
import { isValidElement } from "@lynx-js/react";

import type { LynxStyledElementProps, LynxTextRef } from "../../types";

const countMarker = Symbol.for("@seed-design/lynx-react/count");

interface CountComponent {
  [countMarker]?: true;
}

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - HTML span 속성 및 ARIA 속성
 * - `asChild`
 */
export interface CountProps extends LynxStyledElementProps {}

export const Count = React.forwardRef<unknown, CountProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;

  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      {...nativeProps}
      className={clsx("seed-count", className)}
    >
      {children}
    </text>
  );
});
Count.displayName = "Count";
(Count as CountComponent)[countMarker] = true;

export function isCountElement(node: React.ReactNode): node is React.ReactElement<CountProps> {
  if (!isValidElement(node)) return false;

  return (node.type as CountComponent)[countMarker] === true;
}
