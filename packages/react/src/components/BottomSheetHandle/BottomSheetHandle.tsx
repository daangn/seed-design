import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { Drawer } from "@seed-design/react-drawer";
import { bottomSheetHandle } from "@seed-design/css/recipes/bottom-sheet-handle";
import React from "react";
import clsx from "clsx";

export interface BottomSheetHandleProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const BottomSheetHandle = React.forwardRef<HTMLDivElement, BottomSheetHandleProps>(
  ({ className, ...props }, ref) => {
    const classNames = bottomSheetHandle();

    return (
      <Drawer.Handle ref={ref} className={clsx(classNames.root, className)} {...props}>
        <Primitive.div aria-hidden="true" className={classNames.touchArea} />
      </Drawer.Handle>
    );
  },
);

BottomSheetHandle.displayName = "BottomSheetHandle";
