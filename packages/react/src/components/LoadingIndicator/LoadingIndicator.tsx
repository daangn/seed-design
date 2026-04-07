'use client';
import { mergeProps } from "@ride-developer/dom-utils";
import { Primitive } from "@ride-developer/react-primitive";
import { forwardRef } from "react";
import { usePendingButtonContext } from "./usePendingButton";

export interface LoadingIndicatorProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  indicator: React.ReactNode;
}

export const LoadingIndicator = forwardRef<HTMLSpanElement, LoadingIndicatorProps>((props, ref) => {
  const { indicator, children, ...otherProps } = props;
  const { stateProps } = usePendingButtonContext();
  return (
    <>
      <Primitive.span
        ref={ref}
        {...mergeProps(stateProps, { className: "ride-loading-indicator" }, otherProps)}
      >
        {indicator}
      </Primitive.span>
      <Primitive.span style={{ opacity: 0, display: "inherit", gap: "inherit" }}>
        {children}
      </Primitive.span>
    </>
  );
});
