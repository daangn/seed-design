"use client";

import { wheelPicker, type WheelPickerVariantProps } from "@seed-design/css/recipes/wheel-picker";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import {
  WheelPicker as WheelPickerPrimitive,
  type WheelPickerOption,
} from "@seed-design/react-wheel-picker";
import clsx from "clsx";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { ScrollFog, type ScrollFogProps } from "../ScrollFog/ScrollFog";

const DEFAULT_ITEM_SIZE = {
  small: 36,
  medium: 44,
} as const;
const DEFAULT_VISIBLE_ITEM_COUNT = 5;
const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(wheelPicker);

type WheelPickerCssProperties = React.CSSProperties & {
  "--seed-wheel-picker-item-size"?: string;
  "--seed-wheel-picker-visible-item-count"?: number;
  "--seed-wheel-picker-viewport-size"?: string;
  "--seed-wheel-picker-center-offset"?: string;
  "--seed-wheel-picker-scroll-fog-max-height"?: string;
};

export interface WheelPickerRootProps
  extends WheelPickerVariantProps,
    Omit<
      WheelPickerPrimitive.RootProps,
      "asChild" | "children" | "disabled" | "itemSize" | "readOnly" | "visibleItemCount"
    > {
  /** Wheel Picker를 구성하는 `WheelPicker.Column` 목록입니다. */
  children: React.ReactNode;

  /** 모든 컬럼의 포커스와 값 변경을 막습니다. */
  disabled?: boolean;

  /** 모든 컬럼의 포커스는 유지하면서 스크롤·클릭·키보드 값 변경을 막습니다. */
  readOnly?: boolean;

  /** Scroll Fog가 위아래에서 차지하는 크기입니다. */
  scrollFogSize?: ScrollFogProps["size"];

  /**
   * 한 항목의 높이입니다. 지정하지 않으면 `size`의 기본 높이를 사용합니다.
   */
  itemSize?: number;

  /**
   * 화면에 보이는 항목 수입니다. 5 이상의 홀수를 권장합니다.
   * @default 5
   */
  visibleItemCount?: number;
}

export const WheelPickerRoot = React.forwardRef<HTMLDivElement, WheelPickerRootProps>(
  (props, ref) => {
    const [variantProps, otherProps] = wheelPicker.splitVariantProps(props);
    const {
      children,
      className,
      itemSize: itemSizeProp,
      scrollFogSize = "var(--seed-wheel-picker-scroll-fog-size)",
      style,
      visibleItemCount = DEFAULT_VISIBLE_ITEM_COUNT,
      ...rootProps
    } = otherProps;
    const size = variantProps.size ?? "medium";
    const itemSize = itemSizeProp ?? DEFAULT_ITEM_SIZE[size];
    const centerOffset = ((visibleItemCount - 1) / 2) * itemSize;
    const classNames = wheelPicker({ size });
    const wheelPickerStyle: WheelPickerCssProperties = {
      ...style,
      "--seed-wheel-picker-item-size": `${itemSize}px`,
      "--seed-wheel-picker-visible-item-count": visibleItemCount,
      "--seed-wheel-picker-viewport-size": `${itemSize * visibleItemCount}px`,
      "--seed-wheel-picker-center-offset": `${centerOffset}px`,
      "--seed-wheel-picker-scroll-fog-max-height": `${itemSize * 3}px`,
    };

    return (
      <ClassNamesProvider value={classNames}>
        <WheelPickerPrimitive.Root
          ref={ref}
          className={clsx(classNames.root, className)}
          itemSize={itemSize}
          style={wheelPickerStyle}
          visibleItemCount={visibleItemCount}
          {...rootProps}
        >
          <Primitive.div
            aria-hidden
            className={classNames.selectionIndicator}
            data-wheel-picker-indicator=""
          />
          <ScrollFog
            className={classNames.scrollFog}
            placement={["top", "bottom"]}
            size={scrollFogSize}
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
    | "onIndexChange"
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

  /** 사용자 조작으로 중앙 항목이 바뀔 때마다 호출됩니다. */
  onIndexChange?: WheelPickerPrimitive.ColumnProps["onIndexChange"];

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
