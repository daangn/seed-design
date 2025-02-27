"use client";

import {
  Snackbar as SeedSnackbar,
  useSnackbarAdapter as useSeedSnackbarAdapter,
  useSnackbarContext,
  type CreateSnackbarOptions as SeedCreateSnackbarOptions,
} from "@seed-design/react";
import * as React from "react";

import IconCheckmarkCircleFill from "@daangn/react-monochrome-icon/IconCheckmarkCircleFill";
import IconExclamationmarkCircleFill from "@daangn/react-monochrome-icon/IconExclamationmarkCircleFill";

export interface SnackbarProviderProps extends SeedSnackbar.RootProviderProps {}

export const SnackbarProvider = (props: SnackbarProviderProps) => {
  const { children, ...otherProps } = props;
  return (
    <SeedSnackbar.RootProvider {...otherProps}>
      {children}
      <SeedSnackbar.Region>
        <SeedSnackbar.Renderer />
      </SeedSnackbar.Region>
    </SeedSnackbar.RootProvider>
  );
};

export interface SnackbarProps extends SeedSnackbar.RootProps {
  /**
   * 스낵바에 표시할 메시지
   */
  message: string;

  /**
   * 스낵바에 표시할 액션 버튼의 라벨
   */
  actionLabel?: string;

  /**
   * 액션 버튼 클릭 시 호출되는 콜백
   */
  onAction?: () => void;

  /**
   * 액션 버튼 클릭 시 스낵바를 닫을지 여부
   * @default true
   */
  shouldCloseOnAction?: boolean;
}

/**
 * @see https://seed-design.io/docs/react/components/snackbar
 */
export const Snackbar = React.forwardRef<HTMLDivElement, SnackbarProps>(
  (
    {
      variant = "default",
      children,
      message,
      actionLabel,
      onAction,
      shouldCloseOnAction = true,
      ...otherProps
    },
    ref,
  ) => {
    const api = useSnackbarContext();

    const handleAction: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      e.stopPropagation();
      onAction?.();
      if (shouldCloseOnAction) {
        e.currentTarget.blur();
        api.dismiss();
      }
    };

    return (
      <SeedSnackbar.Root ref={ref} variant={variant} {...otherProps}>
        <SeedSnackbar.PrefixIcon
          svg={
            variant === "positive" ? (
              <IconCheckmarkCircleFill />
            ) : variant === "critical" ? (
              <IconExclamationmarkCircleFill />
            ) : null
          }
        />
        <SeedSnackbar.Message>{message}</SeedSnackbar.Message>
        <SeedSnackbar.ActionButton onClick={handleAction}>
          {actionLabel}
        </SeedSnackbar.ActionButton>
        <SeedSnackbar.CloseButton />
      </SeedSnackbar.Root>
    );
  },
);
Snackbar.displayName = "Snackbar";

// TODO: re-export is ugly; should we namespace CreateSnackbarOptions into Snackbar?
export interface CreateSnackbarOptions extends SeedCreateSnackbarOptions {}

export const useSnackbarAdapter = useSeedSnackbarAdapter;

export const SnackbarAvoidOverlap = SeedSnackbar.AvoidOverlap;
