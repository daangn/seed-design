import * as React from "react";
import type { DistributiveOmit } from "../../utils/styled";
import { Flex, type FlexProps } from "../Flex";

/**
 * @deprecated Use `VStack` instead.
 */
export type StackProps = DistributiveOmit<FlexProps, "flexDirection">;

/**
 * @deprecated Use `VStack` instead.
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  return <Flex ref={ref} display="flex" flexDirection="column" {...props} />;
});

export type VStackProps = DistributiveOmit<FlexProps, "flexDirection">;

export const VStack = React.forwardRef<HTMLDivElement, VStackProps>((props, ref) => {
  return <Flex ref={ref} display="flex" flexDirection="column" {...props} />;
});

export type HStackProps = DistributiveOmit<FlexProps, "flexDirection">;

export const HStack = React.forwardRef<HTMLDivElement, HStackProps>((props, ref) => {
  return <Flex ref={ref} display="flex" flexDirection="row" {...props} />;
});
