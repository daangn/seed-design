import * as React from "react";
import type { BreakpointThreshold } from "../../types/responsive";
import { Flex, type FlexProps } from "../Flex";

/**
 * @deprecated Use `VStack` instead.
 */
export interface StackProps extends Omit<FlexProps, "flexDirection"> {}

/**
 * @deprecated Use `VStack` instead.
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  return <Flex ref={ref} display="flex" flexDirection="column" {...props} />;
});

export interface VStackProps extends Omit<FlexProps, "flexDirection"> {
  hStackFrom?: BreakpointThreshold;
}

export const VStack = React.forwardRef<HTMLDivElement, VStackProps>((props, ref) => {
  const { hStackFrom, ...rest } = props;
  const flexDirection: FlexProps["flexDirection"] = hStackFrom
    ? { base: "column", [hStackFrom]: "row" }
    : "column";

  return <Flex ref={ref} flexDirection={flexDirection} {...rest} />;
});

export interface HStackProps extends Omit<FlexProps, "flexDirection"> {
  vStackFrom?: BreakpointThreshold;
}

export const HStack = React.forwardRef<HTMLDivElement, HStackProps>((props, ref) => {
  const { vStackFrom, ...rest } = props;
  const flexDirection: FlexProps["flexDirection"] = vStackFrom
    ? { base: "row", [vStackFrom]: "column" }
    : "row";

  return <Flex ref={ref} flexDirection={flexDirection} {...rest} />;
});
