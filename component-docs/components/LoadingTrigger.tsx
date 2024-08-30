import { BoxButton } from "@/seed-design/ui/box-button";
import { useSkeletonActions, useSkeletonLoading } from "@/stores/skeleton";
import * as React from "react";

export const LoadingTrigger = () => {
  const isLoading = useSkeletonLoading();
  const { toggleLoading } = useSkeletonActions();
  return (
    <BoxButton
      style={{
        position: "sticky",
        bottom: "20px",
        zIndex: 1000,
      }}
      variant={isLoading ? "neutral" : "brand"}
      onClick={toggleLoading}
    >
      {isLoading ? "Stop Loading" : "Start Loading"}
    </BoxButton>
  );
};
