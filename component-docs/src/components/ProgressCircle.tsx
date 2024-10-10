import * as React from "react";

import {
  ProgressCircle as UIProgressCircle,
  type ProgressCircleProps,
} from "@/snippets/component/progress-circle";
import {
  useProgressCircleDuration,
  useProgressCircleEasing,
  useProgressCircleMaxValue,
  useProgressCircleMinValue,
  useProgressCircleValue,
} from "@/src/stores/progress-circle";

export const ProgressCircle: React.FC = (props: ProgressCircleProps) => {
  const value = useProgressCircleValue();
  const minValue = useProgressCircleMinValue();
  const maxValue = useProgressCircleMaxValue();
  const duration = useProgressCircleDuration();
  const easing = useProgressCircleEasing();

  const { size = "medium", indeterminate = false } = props;

  return (
    <div
      style={
        {
          "--seed-spinner-determinate-duration": duration,
          "--seed-spinner-determinate-timing-function": easing,
        } as React.CSSProperties
      }
    >
      <UIProgressCircle
        size={size}
        indeterminate={indeterminate}
        value={value}
        minValue={minValue}
        maxValue={maxValue}
      />
    </div>
  );
};
