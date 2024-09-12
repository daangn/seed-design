import * as React from "react";

import { BoxButton } from "@/seed-design/ui/box-button";
import {
  useProgressCircleActions,
  useProgressCircleDuration,
  useProgressCircleEasing,
} from "@/src/stores/progress-circle";

import * as css from "./ProgressCircleControls.css";

export const ProgressCircleControls = () => {
  const { set } = useProgressCircleActions();

  const [duration, setDuration] = React.useState(useProgressCircleDuration());
  const [easing, setEasing] = React.useState(useProgressCircleEasing());

  return (
    <div>
      <BoxButton type="button" onClick={() => set({ value: 0 })}>
        0%
      </BoxButton>
      <BoxButton type="button" onClick={() => set({ value: 25 })}>
        25%
      </BoxButton>
      <BoxButton type="button" onClick={() => set({ value: 50 })}>
        50%
      </BoxButton>
      <BoxButton type="button" onClick={() => set({ value: 75 })}>
        75%
      </BoxButton>
      <BoxButton type="button" onClick={() => set({ value: 100 })}>
        100%
      </BoxButton>

      <div>
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
        <BoxButton type="button" onClick={() => set({ duration, easing })}>
          적용
        </BoxButton>
      </div>
    </div>
  );
};
