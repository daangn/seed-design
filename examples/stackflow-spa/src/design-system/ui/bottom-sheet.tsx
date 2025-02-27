"use client";

import IconXmarkLine from "@daangn/react-monochrome-icon/IconXmarkLine";
import { Icon, BottomSheet as SeedBottomSheet } from "@seed-design/react";
import { forwardRef } from "react";

export interface BottomSheetRootProps extends SeedBottomSheet.RootProps {}

/**
 * @see https://seed-design.io/docs/react/components/action-sheet
 */
export const BottomSheetRoot = (props: BottomSheetRootProps) => {
  const { children, ...otherProps } = props;
  return (
    <SeedBottomSheet.Root closeOnInteractOutside={true} {...otherProps}>
      {children}
    </SeedBottomSheet.Root>
  );
};

export interface BottomSheetTriggerProps extends SeedBottomSheet.TriggerProps {}

export const BottomSheetTrigger = SeedBottomSheet.Trigger;

export interface BottomSheetContentProps extends Omit<SeedBottomSheet.ContentProps, "title"> {
  title?: React.ReactNode;

  description?: React.ReactNode;

  layerIndex?: number;
}

export const BottomSheetContent = forwardRef<HTMLDivElement, BottomSheetContentProps>(
  ({ children, title, description, layerIndex, ...otherProps }, ref) => {
    if (
      !title &&
      !otherProps["aria-labelledby"] &&
      !otherProps["aria-label"] &&
      process.env.NODE_ENV !== "production"
    ) {
      console.warn(
        "BottomSheetContent: aria-labelledby or aria-label should be provided if title is not provided.",
      );
    }

    const shouldRenderHeader = title || description;

    return (
      <SeedBottomSheet.Positioner style={{ "--layer-index": layerIndex } as React.CSSProperties}>
        <SeedBottomSheet.Backdrop />
        <SeedBottomSheet.Content ref={ref} {...otherProps}>
          {shouldRenderHeader && (
            <SeedBottomSheet.Header>
              {title && <SeedBottomSheet.Title>{title}</SeedBottomSheet.Title>}
              {description && (
                <SeedBottomSheet.Description>{description}</SeedBottomSheet.Description>
              )}
            </SeedBottomSheet.Header>
          )}
          {children}
          {/* You may implement your own i18n for dismiss label */}
          <SeedBottomSheet.CloseButton>
            <Icon svg={<IconXmarkLine />} />
          </SeedBottomSheet.CloseButton>
        </SeedBottomSheet.Content>
      </SeedBottomSheet.Positioner>
    );
  },
);

export interface BottomSheetBodyProps extends SeedBottomSheet.BodyProps {}

export const BottomSheetBody = SeedBottomSheet.Body;

export interface BottomSheetFooterProps extends SeedBottomSheet.FooterProps {}

export const BottomSheetFooter = SeedBottomSheet.Footer;
