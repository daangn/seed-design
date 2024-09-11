"use client";

import * as React from "react";

import * as css from "./skeleton.css";

interface SkeletonProps {
  width: number | string;
  height: number | string;
  borderRadius: "circle" | "rounded" | "square";
  type?: "wave";
}

// TODO: Spec
// TODO: Recipe
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>((props, ref) => {
  const { width, height, borderRadius, type = "wave" } = props;
  return (
    <div className={css.root}>
      <div
        ref={ref}
        style={{
          width,
          height,
        }}
        className={css.skeleton({ type, borderRadius })}
      />
    </div>
  );
});
