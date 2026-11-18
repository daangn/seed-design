import * as React from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import { timePicker, type TimePickerVariantProps } from "@seed-design/lynx-css/recipes/time-picker";
import clsx from "clsx";
import type { LynxHostProps } from "../../types";
import { WheelPickerItemLabel } from "../WheelPicker/WheelPicker";

export interface TimePickerItemLabelProps extends LynxHostProps<"view">, TimePickerVariantProps {}

/**
 * Time Picker 컬럼의 항목 내용입니다. WheelPicker.Column의 `renderLabel`에서 렌더합니다.
 * 시 컬럼(`columnType="hour"`)은 자릿수가 달라도 숫자를 오른쪽에 맞춥니다.
 */
export const TimePickerItemLabel = React.forwardRef<NodesRef, TimePickerItemLabelProps>(
  (props, ref) => {
    const [variantProps, { children, className, ...nativeProps }] =
      timePicker.splitVariantProps(props);
    const classNames = timePicker(variantProps);

    return (
      <view
        {...nativeProps}
        {...(ref ? { ref } : {})}
        className={clsx(classNames.itemLabel, className)}
      >
        <WheelPickerItemLabel>{children}</WheelPickerItemLabel>
      </view>
    );
  },
);
TimePickerItemLabel.displayName = "TimePickerItemLabel";
