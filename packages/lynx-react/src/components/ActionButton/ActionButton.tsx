/**
 * Lynx CSS를 직접 import합니다.
 * action-button.lynx.mjs의 shared.mjs 유틸리티가 Lynx web-core 메인 스레드에서
 * 실행 시 에러를 발생시키므로, CSS만 side-effect로 가져오고
 * className 생성 로직은 인라인으로 구현합니다.
 */
import "@seed-design/css/recipes/action-button.lynx.css";
import type { ActionButtonVariantProps } from "@seed-design/css/recipes/action-button.lynx";
import type { ReactNode } from "react";

const ROOT = "seed-action-button";
const TEXT = "seed-action-button__text";

function actionButtonClasses(variant: string, size: string, layout: string) {
  const compound = `${ROOT}--size_${size}-layout_${layout}`;
  return {
    root: `${ROOT} ${ROOT}--variant_${variant} ${ROOT}--size_${size} ${ROOT}--layout_${layout} ${compound}`,
    text: `${TEXT}`,
  };
}

export interface ActionButtonProps extends ActionButtonVariantProps {
  children?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  flexGrow?: number;
  bindtap?: () => void;
  "main-thread:bindtap"?: () => void;
}

export function ActionButton({
  variant = "brandSolid",
  size = "medium",
  layout = "withText",
  disabled = false,
  loading = false,
  children,
  className,
  flexGrow,
  bindtap,
  "main-thread:bindtap": mainThreadBindtap,
}: ActionButtonProps) {
  const classes = actionButtonClasses(variant, size, layout);
  const isInteractive = !disabled && !loading;

  return (
    <view
      className={className ? `${classes.root} ${className}` : classes.root}
      style={flexGrow != null ? { flexGrow } : undefined}
      data-disabled={disabled || undefined}
      data-loading={loading || undefined}
      {...(isInteractive && bindtap && { bindtap })}
      {...(isInteractive &&
        mainThreadBindtap && {
          "main-thread:bindtap": mainThreadBindtap,
        })}
    >
      <text
        className={classes.text}
        data-disabled={disabled || undefined}
        data-loading={loading || undefined}
      >
        {children}
      </text>
    </view>
  );
}
