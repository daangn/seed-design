import { Text, VStack, type TextProps } from "@seed-design/react";
import * as React from "react";
import { ActionButton, type ActionButtonProps } from "./action-button";
import type { ScopedColorBg } from "@seed-design/css/vars";

/**
 * @deprecated Use result-section instead.
 */
export interface ErrorStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "color"> {
  title?: React.ReactNode;

  description: React.ReactNode;

  primaryActionProps?: ActionButtonProps;

  secondaryActionProps?: ActionButtonProps;

  /**
   * @default "default"
   */
  variant?: "default" | "basement";
}

const bg = {
  default: "bg.layerDefault",
  basement: "bg.neutralWeak",
} as const satisfies Record<NonNullable<ErrorStateProps["variant"]>, ScopedColorBg>;

const primaryActionVariant = {
  default: "neutralWeak",
  basement: "neutralOutline",
} as const satisfies Record<
  NonNullable<ErrorStateProps["variant"]>,
  NonNullable<ActionButtonProps["variant"]>
>;

const descriptionTextStyle = {
  descriptionOnly: "t5Regular",
  withTitle: "t4Regular",
} as const satisfies Record<string, NonNullable<TextProps["textStyle"]>>;

/**
 * @deprecated Use result-section instead.
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
  return (
    <VStack
      ref={ref}
      justify="center"
      align="center"
      gap="x10"
      px="x14"
      height="full"
      flexGrow={1}
      bg={bg[variant]}
      {...otherProps}
    >
      <VStack gap="x1">
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
      </VStack>
      {(primaryActionProps || secondaryActionProps) && (
        <VStack align="center" gap="x4">
          {primaryActionProps && (
            <ActionButton variant={primaryActionVariant[variant]} {...primaryActionProps} />
          )}
          {secondaryActionProps && (
            <ActionButton
              variant="ghost"
              color="fg.neutralMuted"
              fontWeight="medium"
              bleedX="asPadding"
              bleedY="asPadding"
              {...secondaryActionProps}
            />
          )}
        </VStack>
      )}
    </VStack>
  );
});
ErrorState.displayName = "ErrorState";
