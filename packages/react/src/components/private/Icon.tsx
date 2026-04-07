'use client';
import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";

export interface InternalIconProps {
  svg: React.ReactNode;
}

export const InternalIcon = forwardRef<SVGSVGElement, InternalIconProps>(
  ({ svg, ...otherProps }, ref) => {
    return (
      <Slot ref={ref as React.ForwardedRef<HTMLElement>} aria-hidden {...otherProps}>
        {svg}
      </Slot>
    );
  },
);
