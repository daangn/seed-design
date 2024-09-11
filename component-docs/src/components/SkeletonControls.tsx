import { BoxButton } from "@/seed-design/ui/box-button";
import {
  useSkeletonActions,
  useSkeletonDuration,
  useSkeletonGradient,
  useSkeletonLoading,
  useSkeletonTimingFunction,
} from "@/src/stores/skeleton";
import * as React from "react";
import { controlBlock, controlInput, controlLabel } from "./SkeletonControls.css";

export const SkeletonControls = () => {
  const isLoading = useSkeletonLoading();
  const { toggleLoading, setControls } = useSkeletonActions();
  const [duration, setDuration] = React.useState(useSkeletonDuration());
  const [gradient, setGradient] = React.useState(useSkeletonGradient());
  const [timingFunction, setTimingFunction] = React.useState(useSkeletonTimingFunction());

  return (
    <div>
      <BoxButton variant={isLoading ? "brandWeak" : "brandSolid"} onClick={toggleLoading}>
        {isLoading ? "Stop Loading" : "Start Loading"}
      </BoxButton>
      <div>
        <div className={controlBlock}>
          <label className={controlLabel} htmlFor="duration">
            Duration
          </label>
          <input
            className={controlInput}
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div className={controlBlock}>
          <label className={controlLabel} htmlFor="gradient">
            Gradient
          </label>
          <input
            className={controlInput}
            id="gradient"
            value={gradient}
            onChange={(e) => setGradient(e.target.value)}
          />
        </div>
        <div className={controlBlock}>
          <label className={controlLabel} htmlFor="timing-function">
            Timing Function
          </label>
          <input
            className={controlInput}
            id="timing-function"
            value={timingFunction}
            onChange={(e) => setTimingFunction(e.target.value)}
          />
        </div>
        <BoxButton type="button" onClick={() => setControls({ duration, gradient })}>
          적용
        </BoxButton>
      </div>
    </div>
  );
};
