"use client";

import { Box, Stack, Text } from "@seed-design/react";
import * as React from "react";
import { ActionButton, type ActionButtonProps } from "./action-button";

export interface ErrorStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "color"> {
  title?: React.ReactNode;

  description: React.ReactNode;

  primaryActionProps?: ActionButtonProps;

  secondaryActionProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;

  /**
   * @default "default"
   */
  variant?: "default" | "basement";
}

const bg = {
  default: "bg.layerDefault",
  basement: "bg.neutralWeak",
} as const;

const primaryActionVariant = {
  default: "neutralWeak",
  basement: "neutralOutline",
} as const;

const descriptionTextStyle = {
  descriptionOnly: "t5Regular",
  withTitle: "t4Regular",
} as const;

/**
 * @see https://seed-design.io/react/components/error-state
 */
export const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>((props, ref) => {
  const {
    title,
    description,
    primaryActionProps,
    secondaryActionProps,
    variant = "default",
    ...otherProps
  } = props;
  const { children: secondaryActionLabel, ...secondaryActionOtherProps } =
    secondaryActionProps || {};

  return (
    <Box
      ref={ref}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="x10"
      paddingX="x14"
      height="full"
      flexGrow={1}
      background={bg[variant]}
      {...otherProps}
    >
      <Stack gap="x1">
        <Text align="center" textStyle="t5Bold">
          {title}
        </Text>
        <Text
          align="center"
          color="fg.neutralSubtle"
          textStyle={title ? descriptionTextStyle.withTitle : descriptionTextStyle.descriptionOnly}
        >
          {description}
        </Text>
      </Stack>
      {(primaryActionProps || secondaryActionProps) && (
        <Stack alignItems="center" gap="x4">
          {primaryActionProps && (
            <ActionButton variant={primaryActionVariant[variant]} {...primaryActionProps} />
          )}
          {secondaryActionProps && (
            <button {...secondaryActionOtherProps}>
              <Text color="fg.neutralMuted" textStyle="t4Medium">
                {secondaryActionLabel}
              </Text>
            </button>
          )}
        </Stack>
      )}
    </Box>
  );
});
ErrorState.displayName = "ErrorState";

/**
 * This file is generated snippet from the Seed Design.
 * You can extend the functionality from this snippet if needed.
 */
