import * as React from "react";
import { Box, type BoxProps } from "../Box/Box";

export interface DividerProps {
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
  thickness?: BoxProps["borderBottomWidth"];

  /**
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  role?: Extract<React.AriaRole, "separator">;
}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>((props, ref) => {
  const {
    as = "hr",
    color = "stroke.neutralMuted",
    thickness = 1,
    orientation = "horizontal",
    role,
    ...rest
  } = props;

  return (
    <Box
      ref={ref}
      as={as}
      role={role}
      // if hr, aria-orientation=horizontal is implied if not specified
      // if not hr, aria-orientation is needed
      {...(((as === "hr" && orientation !== "horizontal") ||
        (as !== "hr" && role === "separator")) && {
        "aria-orientation": orientation,
      })}
      display="block"
      borderColor={color}
      borderWidth={0}
      {...(orientation === "vertical" && { borderRightWidth: thickness })}
      {...(orientation === "horizontal" && { borderBottomWidth: thickness })}
      {...rest}
    />
  );
});
