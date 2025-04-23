import * as React from "react";
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

export interface VStackProps extends Omit<FlexProps, "flexDirection"> {}

export const VStack = React.forwardRef<HTMLDivElement, VStackProps>((props, ref) => {
  return <Flex ref={ref} display="flex" flexDirection="column" {...props} />;
});

export interface HStackProps extends Omit<FlexProps, "flexDirection"> {}

export const HStack = React.forwardRef<HTMLDivElement, HStackProps>((props, ref) => {
  return <Flex ref={ref} display="flex" flexDirection="row" {...props} />;
});
