import type { ActivityComponentType } from "@stackflow/react/future";
import * as React from "react";

import Layout from "@/activities/ActivityLayout";
import { Skeleton } from "@/seed-design/ui/skeleton";
import { useSkeletonLoading } from "@/stores/skeleton";

declare module "@stackflow/config" {
  interface Register {
    SkeletonPulse: unknown;
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

const SkeletonPulseActivitiy: ActivityComponentType<"SkeletonPulse"> = () => {
  const isLoading = useSkeletonLoading();

  return (
    <Layout>
      <div style={{ padding: "16px" }}>{isLoading ? <Fallback /> : <div>content</div>}</div>
    </Layout>
  );
};

export default SkeletonPulseActivitiy;

SkeletonPulseActivitiy.displayName = "SkeletonPulseActivitiy";
