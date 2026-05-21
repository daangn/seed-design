import * as React from "react";

import { Box, type BoxProps } from "../Box";

type StackStyleProps =
  | "display"
  | "flexDirection"
  | "alignItems"
  | "justifyContent"
  | "flexWrap"
  | "flexGrow"
  | "flexShrink";

export interface StackProps extends Omit<BoxProps, StackStyleProps> {
  align?: BoxProps["alignItems"];
  justify?: BoxProps["justifyContent"];
  wrap?: BoxProps["flexWrap"];
  grow?: BoxProps["flexGrow"];
  shrink?: BoxProps["flexShrink"];
}

export interface VStackProps extends StackProps {}

export interface HStackProps extends StackProps {}

function getStackProps(props: StackProps) {
  const { align, justify, wrap, grow, shrink, ...restProps } = props;

  return {
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap,
    flexGrow: grow,
    flexShrink: shrink,
    ...restProps,
  };
}

export const VStack = React.forwardRef<unknown, VStackProps>((props, ref) => {
  return <Box ref={ref} display="flex" flexDirection="column" {...getStackProps(props)} />;
});

VStack.displayName = "VStack";

export const HStack = React.forwardRef<unknown, HStackProps>((props, ref) => {
  return <Box ref={ref} display="flex" flexDirection="row" {...getStackProps(props)} />;
});

HStack.displayName = "HStack";
