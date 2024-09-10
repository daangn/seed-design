import { BoxButton } from "@/seed-design/ui/box-button";
import {
  useProgressCircleMaxValue,
  useProgressCircleMinValue,
  useProgressCircleDuration,
  useProgressCircleEasing,
  useProgressCircleValue,
  useProgressCircleActions,
} from "@/stores/progress-circle";
import * as React from "react";

import * as css from "./ProgressCircleControls.css";

export const ProgressCircleControls = () => {
  const [value, setValue] = React.useState(useProgressCircleValue());
  const [maxValue, setMaxValue] = React.useState(useProgressCircleMaxValue());
  const [minValue, setMinValue] = React.useState(useProgressCircleMinValue());
  const [duration, setDuration] = React.useState(useProgressCircleDuration());
  const [easing, setEasing] = React.useState(useProgressCircleEasing());

  const { set } = useProgressCircleActions();

  return (
    <div>
      <div className={css.controlBlock}>
        <label className={css.controlLabel} htmlFor="value">
          value
        </label>
        <input
          className={css.controlInput}
          id="value"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          min={minValue}
          max={maxValue}
        />
      </div>
      <div className={css.controlBlock}>
        <label className={css.controlLabel} htmlFor="min-value">
          Min Value
        </label>
        <input
          className={css.controlInput}
          id="min-value"
          value={minValue}
          onChange={(e) => setMinValue(Number(e.target.value))}
        />
      </div>
      <div className={css.controlBlock}>
        <label className={css.controlLabel} htmlFor="max-value">
          Max Value
        </label>
        <input
          className={css.controlInput}
          id="max-value"
          value={maxValue}
          onChange={(e) => setMaxValue(Number(e.target.value))}
        />
      </div>
      <div className={css.controlBlock}>
        <label className={css.controlLabel} htmlFor="duration">
          Duration
        </label>
        <input
          className={css.controlInput}
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>
      <div className={css.controlBlock}>
        <label className={css.controlLabel} htmlFor="easing">
          Easing
        </label>
        <input
          className={css.controlInput}
          id="easing"
          value={easing}
          onChange={(e) => setEasing(e.target.value)}
        />
      </div>
      <BoxButton type="button" onClick={() => set({ value, minValue, maxValue, duration, easing })}>
        적용
      </BoxButton>
    </div>
  );
};
