import * as React from "react";
import { Box, type BoxProps } from "../Box/Box";

export interface DividerProps extends Omit<React.HTMLAttributes<HTMLHRElement>, "color"> {
  /**
   * The HTML element to use for the divider.
   * Keep in mind that "hr" elements are read by screen readers as a semantic break with an implicit role="separator"
   * If the element should be read by screen readers but be rendered as an element other than "hr", give an explicit role="separator"
   * @default "hr"
   */
  as?: "hr" | "div" | "li";

  /**
   * @default "stroke.neutralMuted"
   */
  color?: BoxProps["borderColor"];

  /**
   * @default 1
   */
  thickness?: BoxProps["borderWidth"];

  /**
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /**
   * @default false
   */
  inset?: boolean;
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  (
    {
      as = "hr",
      color = "stroke.neutralMuted",
      thickness = 1,
      orientation = "horizontal",
      inset = false,
      ...props
    },
    ref,
  ) => {
    return (
      <Box
        ref={ref}
        as={as}
        // if hr, aria-orientation=horizontal is implied if not specified
        {...(((as === "hr" &&
          orientation !== "horizontal" &&
          (props.role === undefined || props.role === "separator")) ||
          // if not hr but role is separator aria-orientation is needed
          (as !== "hr" && props.role === "separator")) && {
          "aria-orientation": orientation,
        })}
        display="block"
        borderColor={color}
        borderWidth={0}
        {...(orientation === "vertical" && { borderRightWidth: thickness })}
        {...(orientation === "horizontal" && { borderBottomWidth: thickness })}
        {...props}
        style={{
          ...(inset &&
            orientation === "horizontal" && {
              marginLeft: "16px",
              marginRight: "16px",
            }),
          ...(inset &&
            orientation === "vertical" && {
              marginTop: "16px",
              marginBottom: "16px",
            }),
          ...props.style,
        }}
      />
    );
  },
);
