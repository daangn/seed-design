import * as React from "react";
import { Text, VStack, type TextProps, type VStackProps } from "@seed-design/react";
import { ActionButton, type ActionButtonProps } from "./action-button";

export interface ResultSectionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "children"> {
  /**
   * @default "large"
   */
  size?: "large" | "medium";

  asset?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;

  primaryActionProps?: ActionButtonProps;
  secondaryActionProps?: ActionButtonProps;
}

const textStyles = {
  title: {
    large: "t8Bold",
    medium: "t5Bold",
  },
  description: {
    large: "t5Regular",
    medium: "t4Regular",
  },
} as const satisfies Record<
  string,
  Record<NonNullable<ResultSectionProps["size"]>, NonNullable<TextProps["textStyle"]>>
>;

const textContainerProperties = {
  large: {
    gap: "x3",
    pb: "x7",
  },
  medium: {
    gap: "x2",
    pb: "x6",
  },
} as const satisfies Record<NonNullable<ResultSectionProps["size"]>, VStackProps>;

/**
 * @see https://seed-design.io/react/components/result-section
 */
export const ResultSection = React.forwardRef<HTMLDivElement, ResultSectionProps>((props, ref) => {
  const {
    size = "large",
    asset,
    title,
    description,
    primaryActionProps,
    secondaryActionProps,
    ...otherProps
  } = props;
  return (
    <VStack ref={ref} justify="center" align="center" px="x12" py="x4" grow {...otherProps}>
      {asset}
      <VStack {...textContainerProperties[size]}>
        <Text
          align="center"
          whiteSpace="pre-line"
          color="fg.neutral"
          textStyle={textStyles.title[size]}
        >
          {title}
        </Text>
        <Text
          align="center"
          whiteSpace="pre-line"
          color="fg.neutralMuted"
          textStyle={textStyles.description[size]}
        >
          {description}
        </Text>
      </VStack>
      {(primaryActionProps || secondaryActionProps) && (
        <VStack align="center" gap="x5">
          {primaryActionProps && (
            <ActionButton
              variant="neutralWeak"
              size="medium"
              layout="withText"
              {...primaryActionProps}
            />
          )}
          {secondaryActionProps && (
            <ActionButton
              variant="ghost"
              size="small"
              color="fg.neutral"
              fontWeight="bold"
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
ResultSection.displayName = "ResultSection";
