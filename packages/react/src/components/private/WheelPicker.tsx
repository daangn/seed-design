"use client";

import { wheelPicker } from "@seed-design/css/recipes/wheel-picker";
import { Primitive } from "@seed-design/react-primitive";
import * as HeadlessWheelPicker from "@seed-design/react-wheel-picker";
import clsx from "clsx";
import * as React from "react";
import { ScrollFog, type ScrollFogProps } from "../ScrollFog/ScrollFog";

const classNames = wheelPicker();

type WheelPickerCssProperties = React.CSSProperties & {
  "--seed-wheel-picker-item-size"?: string;
  "--seed-wheel-picker-visible-item-count"?: number;
  "--seed-wheel-picker-viewport-size"?: string;
  "--seed-wheel-picker-center-offset"?: string;
};

export interface InternalWheelPickerRootProps
  extends Omit<HeadlessWheelPicker.WheelPickerRootProps, "children"> {
  children: React.ReactNode;
  columnsClassName?: string;
  scrollFogClassName?: string;
  selectionIndicatorClassName?: string;
  fogSize?: ScrollFogProps["size"];
}

export const InternalWheelPickerRoot = React.forwardRef<
  HTMLDivElement,
  InternalWheelPickerRootProps
>(
  (
    {
      children,
      className,
      columnsClassName,
      scrollFogClassName,
      selectionIndicatorClassName,
      fogSize,
      itemSize,
      visibleItemCount,
      style,
      ...props
    },
    ref,
  ) => {
    const centerOffset = ((visibleItemCount - 1) / 2) * itemSize;
    const wheelPickerStyle: WheelPickerCssProperties = {
      ...style,
      "--seed-wheel-picker-item-size": `${itemSize}px`,
      "--seed-wheel-picker-visible-item-count": visibleItemCount,
      "--seed-wheel-picker-viewport-size": `${itemSize * visibleItemCount}px`,
      "--seed-wheel-picker-center-offset": `${centerOffset}px`,
    };

    return (
      <HeadlessWheelPicker.WheelPickerRoot
        ref={ref}
        itemSize={itemSize}
        visibleItemCount={visibleItemCount}
        className={clsx(classNames.root, className)}
        style={wheelPickerStyle}
        {...props}
      >
        <div
          aria-hidden
          className={clsx(classNames.selectionIndicator, selectionIndicatorClassName)}
          data-wheel-picker-indicator=""
        />
        <ScrollFog
          className={clsx(classNames.scrollFog, scrollFogClassName)}
          placement={["top", "bottom"]}
          size={fogSize}
          hideScrollBar
          data-wheel-picker-scroll-fog=""
        >
          <div className={clsx(classNames.columns, columnsClassName)} data-wheel-picker-columns="">
            {children}
          </div>
        </ScrollFog>
      </HeadlessWheelPicker.WheelPickerRoot>
    );
  },
);
InternalWheelPickerRoot.displayName = "InternalWheelPickerRoot";

export interface InternalWheelPickerColumnProps
  extends Omit<HeadlessWheelPicker.WheelPickerColumnProps, "renderOption"> {
  itemClassName?: string;
}

export const InternalWheelPickerColumn = React.forwardRef<
  HTMLDivElement,
  InternalWheelPickerColumnProps
>(({ className, itemClassName, ...props }, ref) => (
  <HeadlessWheelPicker.WheelPickerColumn
    ref={ref}
    className={clsx(classNames.column, className)}
    renderOption={(option, optionProps) => (
      <Primitive.div className={clsx(classNames.item, itemClassName)} {...optionProps}>
        {option.label}
      </Primitive.div>
    )}
    {...props}
  />
));
InternalWheelPickerColumn.displayName = "InternalWheelPickerColumn";
