import * as React from "react";
import type { DistributiveOmit } from "../../utils/styled";
import { Flex, type FlexProps } from "../Flex";

export type VStackProps = DistributiveOmit<FlexProps, "flexDirection">;

export const VStack = React.forwardRef<HTMLDivElement, VStackProps>((props, ref) => {
  return <Flex ref={ref} display="flex" flexDirection="column" {...props} />;
});

export type HStackProps = DistributiveOmit<FlexProps, "flexDirection">;

export const HStack = React.forwardRef<HTMLDivElement, HStackProps>((props, ref) => {
  return <Flex ref={ref} display="flex" flexDirection="row" {...props} />;
});
