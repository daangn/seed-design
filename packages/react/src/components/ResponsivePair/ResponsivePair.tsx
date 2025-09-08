import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { handleDimension, useStyleProps } from "../../utils/styled";
import { Flex, type FlexProps } from "../Flex";

export interface ResponsivePairProps extends Omit<FlexProps, "flexDirection" | "flexWrap"> {
  /**
   * @default "wrap-reverse"
   */
  wrap?: "wrap" | "wrap-reverse";

  children: [React.ReactNode, React.ReactNode];
}

export const ResponsivePair = React.forwardRef<HTMLDivElement, ResponsivePairProps>(
  (props, ref) => {
    const { wrap = "wrap-reverse", gap, children, ...rest } = props;
    const childrenArray = React.Children.toArray(children);
    const { style } = useStyleProps({
      minWidth: `calc(${100 / childrenArray.length}% - ${handleDimension(gap)} / ${childrenArray.length})`,
      flexGrow: 1,
    });

    return (
      <Flex
        ref={ref}
        display="flex"
        flexDirection="row"
        alignContent="stretch"
        flexWrap={wrap}
        gap={gap}
        {...rest}
      >
        <Slot style={style}>{childrenArray[0]}</Slot>
        <Slot style={style}>{childrenArray[1]}</Slot>
      </Flex>
    );
  },
);
