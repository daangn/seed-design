import { BoxButton } from "@/seed-design/ui/box-button";
import {
  useSkeletonActions,
  useSkeletonDuration,
  useSkeletonGradient,
  useSkeletonLoading,
} from "@/stores/skeleton";
import * as React from "react";
import { controlBlock, controlInput, controlLabel } from "./SkeletonControls.css";

export const SkeletonControls = () => {
  const isLoading = useSkeletonLoading();
  const { toggleLoading, setControls } = useSkeletonActions();
  const [duration, setDuration] = React.useState(useSkeletonDuration());
  const [gradient, setGradient] = React.useState(useSkeletonGradient());

  return (
    <div>
      <BoxButton variant={isLoading ? "neutral" : "brand"} onClick={toggleLoading}>
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
          <label className={controlLabel} htmlFor="duration">
            Gradient
          </label>
          <input
            className={controlInput}
            id="gradient"
            value={gradient}
            onChange={(e) => setGradient(e.target.value)}
          />
        </div>
        <BoxButton type="button" onClick={() => setControls({ duration, gradient })}>
          적용
        </BoxButton>
      </div>
    </div>
  );
};
