"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { dataAttr, mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import * as React from "react";
import { WheelPickerProvider } from "./WheelPickerContext";
import {
  useWheelPickerColumn,
  type RenderedWheelPickerOption,
  type UseWheelPickerColumnProps,
  type WheelPickerOptionProps,
} from "./useWheelPickerColumn";

export interface WheelPickerRootProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {
  itemSize: number;
  visibleItemCount: number;
  disabled?: boolean;
  readOnly?: boolean;
}

export const WheelPickerRoot = React.forwardRef<HTMLDivElement, WheelPickerRootProps>(
  ({ itemSize, visibleItemCount, disabled = false, readOnly = false, children, ...props }, ref) => {
    if (process.env.NODE_ENV !== "production") {
      if (!Number.isFinite(itemSize) || itemSize <= 0) {
        console.warn("WheelPicker.Root: itemSize는 0보다 큰 유한한 숫자여야 합니다.");
      }
      if (
        !Number.isInteger(visibleItemCount) ||
        visibleItemCount <= 0 ||
        visibleItemCount % 2 === 0
      ) {
        console.warn("WheelPicker.Root: visibleItemCount는 0보다 큰 홀수여야 합니다.");
      }
      if (!props["aria-label"] && !props["aria-labelledby"]) {
        console.warn("WheelPicker.Root: aria-label 또는 aria-labelledby를 제공해야 합니다.");
      }
    }

    const context = React.useMemo(
      () => ({ itemSize, visibleItemCount, disabled, readOnly }),
      [disabled, itemSize, readOnly, visibleItemCount],
    );

    return (
      <WheelPickerProvider value={context}>
        <Primitive.div
          ref={ref}
          role="group"
          data-disabled={dataAttr(disabled)}
          data-readonly={dataAttr(readOnly)}
          {...props}
        >
          {children}
        </Primitive.div>
      </WheelPickerProvider>
    );
  },
);
WheelPickerRoot.displayName = "WheelPickerRoot";

export interface WheelPickerColumnProps
  extends UseWheelPickerColumnProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  renderOption?: (
    option: RenderedWheelPickerOption,
    props: WheelPickerOptionProps,
  ) => React.ReactNode;
}

export const WheelPickerColumn = React.forwardRef<HTMLDivElement, WheelPickerColumnProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      onIndexChange,
      loop,
      valueChangeBehavior,
      getAriaValueText,
      renderOption,
      ...props
    },
    ref,
  ) => {
    const api = useWheelPickerColumn({
      options,
      value,
      defaultValue,
      onValueChange,
      onIndexChange,
      loop,
      valueChangeBehavior,
      getAriaValueText,
    });

    return (
      <Primitive.div
        ref={composeRefs(ref, api.refs.column)}
        {...mergeProps(api.columnProps, props)}
      >
        {api.renderedOptions.map((option) => (
          <React.Fragment key={option.physicalIndex}>
            {renderOption ? (
              renderOption(option, api.getOptionProps(option))
            ) : (
              <Primitive.div {...api.getOptionProps(option)}>{option.label}</Primitive.div>
            )}
          </React.Fragment>
        ))}
      </Primitive.div>
    );
  },
);
WheelPickerColumn.displayName = "WheelPickerColumn";
