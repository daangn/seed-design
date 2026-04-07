'use client';
import { aspectRatio as aspectRatioRecipe } from "@ride-developer/css/recipes/aspect-ratio";
import clsx from "clsx";
import * as React from "react";
import { Box, type BoxProps } from "../Box/Box";

export interface AspectRatioProps extends BoxProps {
  /**
   * The aspect ratio of the aspect ratio container (width / height).
   * @default 4 / 3
   */
  ratio?: number;

  // following 3 are just here for JSDoc purposes

  /**
   * @default "relative"
   */
  position?: BoxProps["position"];
  /**
   * @default "hidden"
   */
  overflowX?: BoxProps["overflowX"];
  /**
   * @default "hidden"
   */
  overflowY?: BoxProps["overflowY"];
}

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 4 / 3, children, className, style, ...rest }, ref) => {
    const child = React.Children.only(children);
    const aspectRatio = aspectRatioRecipe();

    return (
      <Box
        ref={ref}
        className={clsx(aspectRatio, className)}
        position="relative" // TODO: these are currently here but we might want to make AspectRatio just a Primitive.div which takes BoxProps
        overflowX="hidden"
        overflowY="hidden"
        style={
          {
            // NOTE: aspectRatio는 iOS 15+부터 지원하기 때문에 padding으로 ratio hack을 사용합니다.
            "--ride-aspect-ratio-padding": `${(1 / ratio) * 100}%`,
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {child}
      </Box>
    );
  },
);

AspectRatio.displayName = "AspectRatio";
