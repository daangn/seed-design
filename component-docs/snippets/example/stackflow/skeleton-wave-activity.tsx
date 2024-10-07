import type { ActivityComponentType } from "@stackflow/react/future";
import * as React from "react";

import Layout from "@/src/stackflow/ActivityLayout";
import { Skeleton } from "@/snippets/component/skeleton";
import {
  useSkeletonDuration,
  useIsRealLoading,
  useSkeletonLoading,
  useSkeletonTimingFunction,
  useSkeletonInitTransitionDuration,
  useSkeletonGradient,
} from "@/src/stores/skeleton";

declare module "@stackflow/config" {
  interface Register {
    SkeletonWave: unknown;
  }
}

const Fallback = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Skeleton width="100%" height="300px" borderRadius="square" />
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <Skeleton width="50px" height="50px" borderRadius="circle" />
        <Skeleton width="100%" height="20px" borderRadius="rounded" />
        <Skeleton width="200px" height="20px" borderRadius="rounded" />
      </div>
    </div>
  );
};

const SkeletonWaveActivity: ActivityComponentType<"SkeletonWave"> = () => {
  const isLoading = useSkeletonLoading();
  const isRealLoading = useIsRealLoading();
  const animationDuration = useSkeletonDuration();
  const animationTiming = useSkeletonTimingFunction();
  const initTransitionDuration = useSkeletonInitTransitionDuration();
  const gradient = useSkeletonGradient();

  return (
    <Layout>
      <div
        style={
          {
            padding: "16px",
            "--skeleton-gradient": gradient,
            "--skeleton-init-transition-duration": initTransitionDuration,
            "--skeleton-animation-duration": animationDuration,
            "--skeleton-animation-timing-function": animationTiming,
          } as React.CSSProperties
        }
      >
        {isLoading ? isRealLoading && <Fallback /> : <div>content</div>}
      </div>
    </Layout>
  );
};

export default SkeletonWaveActivity;

SkeletonWaveActivity.displayName = "SkeletonWaveActivity";
