"use client";

import { wheelPickerPublic } from "@seed-design/css/recipes/wheel-picker-public";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import {
  WheelPicker as WheelPickerPrimitive,
  type WheelPickerOption,
} from "@seed-design/react-wheel-picker";
import clsx from "clsx";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { ScrollFog } from "../ScrollFog/ScrollFog";

const DEFAULT_ITEM_SIZE = 44;
const DEFAULT_VISIBLE_ITEM_COUNT = 5;
const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(wheelPickerPublic);

type WheelPickerCssProperties = React.CSSProperties & {
  "--seed-wheel-picker-public-item-size"?: string;
  "--seed-wheel-picker-public-visible-item-count"?: number;
  "--seed-wheel-picker-public-viewport-size"?: string;
  "--seed-wheel-picker-public-center-offset"?: string;
};

export interface WheelPickerRootProps
  extends Omit<
    WheelPickerPrimitive.RootProps,
    "asChild" | "children" | "disabled" | "itemSize" | "readOnly" | "visibleItemCount"
  > {
  /** Wheel Picker를 구성하는 `WheelPicker.Column` 목록입니다. */
  children: React.ReactNode;

  /** 모든 컬럼의 포커스와 값 변경을 막습니다. */
  disabled?: boolean;

  /**
   * 한 항목의 높이입니다.
   * @default 44
   */
  itemSize?: number;

  /**
   * 화면에 보이는 항목 수입니다. 0보다 큰 홀수여야 합니다.
   * @default 5
   */
  visibleItemCount?: number;
}

export const WheelPickerRoot = React.forwardRef<HTMLDivElement, WheelPickerRootProps>(
  (
    {
      children,
      className,
      itemSize = DEFAULT_ITEM_SIZE,
      style,
      visibleItemCount = DEFAULT_VISIBLE_ITEM_COUNT,
      ...props
    },
    ref,
  ) => {
    const centerOffset = ((visibleItemCount - 1) / 2) * itemSize;
    const classNames = wheelPickerPublic();
    const wheelPickerStyle: WheelPickerCssProperties = {
      ...style,
      "--seed-wheel-picker-public-item-size": `${itemSize}px`,
      "--seed-wheel-picker-public-visible-item-count": visibleItemCount,
      "--seed-wheel-picker-public-viewport-size": `${itemSize * visibleItemCount}px`,
      "--seed-wheel-picker-public-center-offset": `${centerOffset}px`,
    };

    return (
      <ClassNamesProvider value={classNames}>
        <WheelPickerPrimitive.Root
          ref={ref}
          className={clsx(classNames.root, className)}
          itemSize={itemSize}
          style={wheelPickerStyle}
          visibleItemCount={visibleItemCount}
          {...props}
          readOnly={false}
        >
          <Primitive.div
            aria-hidden
            className={classNames.selectionIndicator}
            data-wheel-picker-indicator=""
          />
          <ScrollFog
            className={classNames.scrollFog}
            placement={["top", "bottom"]}
            size={centerOffset}
            hideScrollBar
            data-wheel-picker-scroll-fog=""
          >
            <Primitive.div className={classNames.columns} data-wheel-picker-columns="">
              {children}
            </Primitive.div>
          </ScrollFog>
        </WheelPickerPrimitive.Root>
      </ClassNamesProvider>
    );
  },
);
WheelPickerRoot.displayName = "WheelPickerRoot";

export interface WheelPickerItemLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

/** Wheel Picker 항목의 기본 여백과 타이포그래피를 적용합니다. */
export const WheelPickerItemLabel = React.forwardRef<HTMLDivElement, WheelPickerItemLabelProps>(
  ({ className, ...props }, ref) => {
    const classNames = useClassNames();

    return (
      <Primitive.div
        ref={ref}
        className={clsx(classNames.itemLabel, className)}
        {...props}
        data-wheel-picker-item-label=""
      />
    );
  },
);
WheelPickerItemLabel.displayName = "WheelPickerItemLabel";

export interface WheelPickerColumnProps
  extends Omit<
    WheelPickerPrimitive.ColumnProps,
    | "asChild"
    | "defaultValue"
    | "getAriaValueText"
    | "loop"
    | "onValueChange"
    | "options"
    | "renderOption"
    | "value"
    | "valueChangeBehavior"
  > {
  /** 컬럼에 표시할 선택 항목입니다. 하나 이상의 항목을 제공해야 합니다. */
  options: readonly WheelPickerOption[];

  /** 제어 상태에서 현재 선택된 항목의 값입니다. */
  value?: string;

  /** 비제어 상태에서 처음 선택할 항목의 값입니다. */
  defaultValue?: string;

  /** 선택 값이 바뀔 때 호출됩니다. */
  onValueChange?: WheelPickerPrimitive.ColumnProps["onValueChange"];

  /**
   * 마지막 항목과 첫 항목을 이어 반복해서 탐색할지 여부입니다.
   * @default false
   */
  loop?: boolean;

  /**
   * 외부에서 `value`가 변경되었을 때 새 값으로 이동하는 스크롤 방식입니다.
   * @default "auto"
   */
  valueChangeBehavior?: ScrollBehavior;

  /** 현재 값에 대응하는 접근성 텍스트를 반환합니다. */
  getAriaValueText?: (value: string) => string;

  /**
   * 기본 `ItemLabel` 대신 항목에 표시할 요소를 반환합니다.
   * 반환한 요소는 항목의 선택·비활성 색상을 적용할 수 있도록 `currentColor`를 상속해야 합니다.
   */
  renderLabel?: (option: WheelPickerOption) => React.ReactNode;
}

export const WheelPickerColumn = React.forwardRef<HTMLDivElement, WheelPickerColumnProps>(
  ({ className, renderLabel, ...props }, ref) => {
    const classNames = useClassNames();

    return (
      <WheelPickerPrimitive.Column
        ref={ref}
        className={clsx(classNames.column, className)}
        {...props}
        renderOption={(option, optionProps) => (
          <Primitive.div className={classNames.item} {...optionProps}>
            {renderLabel ? (
              renderLabel(option)
            ) : (
              <WheelPickerItemLabel>{option.label}</WheelPickerItemLabel>
            )}
          </Primitive.div>
        )}
      />
    );
  },
);
WheelPickerColumn.displayName = "WheelPickerColumn";

export type { WheelPickerOption };
