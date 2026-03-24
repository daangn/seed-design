import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
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
    const style = {
      "--seed-box-min-width": `calc(${100 / childrenArray.length}% - var(--responsive-pair-gap) / ${childrenArray.length})`,
      "--seed-box-flex-grow": 1,
    } as React.CSSProperties;

    return (
      <Flex
        ref={ref}
        display="flex"
        flexDirection="row"
        alignContent="stretch"
        flexWrap={wrap}
        gap={gap}
        {...rest}
        style={
          {
            "--responsive-pair-gap": "var(--seed-box-gap)",
            ...rest.style,
          } as React.CSSProperties
        }
      >
        <Slot style={style}>{childrenArray[0]}</Slot>
        <Slot style={style}>{childrenArray[1]}</Slot>
      </Flex>
    );
  },
);
