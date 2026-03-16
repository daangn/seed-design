import { forwardRef } from "react";
import { Flex, type FlexProps } from "../Flex/Flex";

export type VStackProps = FlexProps;
export type HStackProps = FlexProps;

export const VStack = forwardRef<any, VStackProps>((props, ref) => {
  return <Flex ref={ref} display="flex" flexDirection="column" {...props} />;
});

VStack.displayName = "VStack";

export const HStack = forwardRef<any, HStackProps>((props, ref) => {
  return <Flex ref={ref} display="flex" flexDirection="row" {...props} />;
});

HStack.displayName = "HStack";
