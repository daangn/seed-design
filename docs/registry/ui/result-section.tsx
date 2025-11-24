"use client";

import { Text, VStack, type TextProps, type unstable_StyleProps } from "@seed-design/react";
import * as React from "react";
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

const gaps = {
  betweenTexts: {
    large: "x3",
    medium: "x2",
  },
  betweenActions: {
    large: "x5",
    medium: "x4",
  },
} as const satisfies Record<
  string,
  Record<NonNullable<ResultSectionProps["size"]>, unstable_StyleProps["gap"]>
>;

const paddings = {
  textTop: {
    large: undefined,
    medium: "x2",
  },
  textBottom: {
    large: "x7",
    medium: "x8",
  },
} as const satisfies Record<
  string,
  Record<NonNullable<ResultSectionProps["size"]>, unstable_StyleProps["p"]>
>;

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
      <VStack
        gap={gaps.betweenTexts[size]}
        pt={paddings.textTop[size]}
        pb={paddings.textBottom[size]}
      >
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
          color="fg.neutralSubtle"
          textStyle={textStyles.description[size]}
        >
          {description}
        </Text>
      </VStack>
      {(primaryActionProps || secondaryActionProps) && (
        <VStack align="center" gap={gaps.betweenActions[size]}>
          {primaryActionProps && <ActionButton variant="neutralWeak" {...primaryActionProps} />}
          {secondaryActionProps && (
            <ActionButton
              variant="ghost"
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
