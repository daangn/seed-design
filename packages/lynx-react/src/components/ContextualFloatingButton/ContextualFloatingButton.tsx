import {
  contextualFloatingButton,
  type ContextualFloatingButtonVariantProps,
} from "@seed-design/lynx-css/recipes/contextual-floating-button";
import clsx from "clsx";
import * as React from "@lynx-js/react";

import { usePressTap } from "../../hooks/usePressTap";
import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type {
  LynxAccessibilityProps,
  LynxElementProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTouchProps,
  LynxViewRef,
} from "../../types";
import { toArray } from "../../utils/children";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";
import { IconRequired, IconSlotProvider, getIconSlotName } from "../Icon/Icon";
import { ProgressCircleRange, ProgressCircleRoot } from "../ProgressCircle";

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(contextualFloatingButton);

type ContextualFloatingButtonPublicVariantProps = Omit<
  ContextualFloatingButtonVariantProps,
  "pressed"
>;

interface ContextualFloatingButtonRootProps
  extends ContextualFloatingButtonVariantProps,
    Omit<LynxStyledElementProps, "flatten">,
    LynxTouchProps,
    LynxAccessibilityProps {
  flatten?: false;
}

const ContextualFloatingButtonRoot = React.forwardRef<unknown, ContextualFloatingButtonRootProps>(
  (innerProps, ref) => {
    const [variantProps, otherProps] = contextualFloatingButton.splitVariantProps(innerProps);
    const classNames = contextualFloatingButton(variantProps);
    const { children, className, ...nativeProps } = otherProps;
    const iconSlotContextValue = React.useMemo(
      () => ({
        classNames: {
          icon: classNames.icon,
          prefixIcon: classNames.prefixIcon,
        },
        deps: [
          variantProps.variant ?? null,
          variantProps.layout ?? null,
          variantProps.pressed ?? false,
          variantProps.disabled ?? false,
          variantProps.loading ?? false,
        ],
      }),
      [
        classNames.icon,
        classNames.prefixIcon,
        variantProps.variant,
        variantProps.layout,
        variantProps.pressed,
        variantProps.disabled,
        variantProps.loading,
      ],
    );

    return (
      <ClassNamesProvider value={classNames}>
        <IconSlotProvider value={iconSlotContextValue}>
          <view
            {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
            className={clsx(classNames.root, className)}
          >
            {children}
          </view>
        </IconSlotProvider>
      </ClassNamesProvider>
    );
  },
);
ContextualFloatingButtonRoot.displayName = "ContextualFloatingButtonRoot";

function ContextualFloatingButtonText({ children }: LynxElementProps) {
  const classNames = useClassNames();

  return <text className={classNames.text}>{children}</text>;
}

function ContextualFloatingButtonContent({
  children,
  isIconOnly,
}: {
  children: React.ReactNode;
  isIconOnly: boolean;
}) {
  const classNames = useClassNames();
  const prefixIconChildren: React.ReactNode[] = [];
  const iconChildren: React.ReactNode[] = [];
  const textChildren: React.ReactNode[] = [];

  for (const child of toArray(children)) {
    const slotName = getIconSlotName(child);

    if (slotName === "prefixIcon") {
      prefixIconChildren.push(child);
      continue;
    }
    if (slotName === "icon") {
      iconChildren.push(child);
      continue;
    }

    textChildren.push(child);
  }

  return (
    <view className={classNames.content}>
      {isIconOnly ? (
        <>{iconChildren}</>
      ) : (
        <>
          {prefixIconChildren}
          {textChildren.length > 0 ? (
            <ContextualFloatingButtonText>{textChildren}</ContextualFloatingButtonText>
          ) : null}
        </>
      )}
    </view>
  );
}

function ContextualFloatingButtonLoadingIndicator() {
  const classNames = useClassNames();

  return (
    <view className={classNames.loadingIndicator}>
      <ProgressCircleRoot size="16" tone="inherit">
        <ProgressCircleRange />
      </ProgressCircleRoot>
    </view>
  );
}

/**
 * @platform Lynx
 *
 * Web version differences:
 * - Native `<view>` and `bindtap` / `main-thread:bindtap` replace HTML button events,
 *   form props, and `asChild`.
 * - `loading` blocks both native tap callbacks, unlike the React reference which only
 *   exposes pending state to its underlying button.
 */
export interface ContextualFloatingButtonProps
  extends ContextualFloatingButtonPublicVariantProps,
    Omit<LynxStyledElementProps, "flatten">,
    LynxPressableProps,
    LynxAccessibilityProps {}

export const ContextualFloatingButton = React.forwardRef<unknown, ContextualFloatingButtonProps>(
  (props, ref) => {
    const [variantProps, otherProps] = contextualFloatingButton.splitVariantProps(props);
    const {
      children,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElement = true,
      "accessibility-label": accessibilityLabel,
      "accessibility-role-description": accessibilityRoleDescription = "button",
      "accessibility-traits": accessibilityTraits,
      ...nativeProps
    } = otherProps;
    const layout = variantProps.layout ?? "withText";
    const disabled = variantProps.disabled ?? false;
    const loading = variantProps.loading ?? false;
    const isInteractive = !disabled && !loading;

    if (
      process.env.NODE_ENV !== "production" &&
      layout === "iconOnly" &&
      accessibilityElement &&
      !accessibilityLabel
    ) {
      console.warn(
        'ContextualFloatingButton: `layout="iconOnly"` requires `accessibility-label` for accessibility.',
      );
    }

    const { pressed, bindtouchstart, bindtouchend, bindtouchcancel, ...pressTapHandlers } =
      usePressTap({
        disabled: !isInteractive,
        onTap: bindtap,
        mainThreadOnTap: mainThreadBindtap,
      });
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
      disabled: !isInteractive,
      onTouchStart: bindtouchstart,
      onTouchEnd: bindtouchend,
      onTouchCancel: bindtouchcancel,
    });

    return (
      <IconRequired enabled={layout === "iconOnly"}>
        <ContextualFloatingButtonRoot
          {...mergeProps(
            { ref },
            scaleFeedbackTargetProps,
            scaleFeedbackTriggerProps,
            pressTapHandlers,
            nativeProps,
          )}
          {...variantProps}
          pressed={pressed}
          accessibility-element={accessibilityElement}
          accessibility-label={accessibilityLabel}
          accessibility-role-description={accessibilityRoleDescription}
          accessibility-traits={
            accessibilityTraits ?? (disabled || loading ? "disabled" : undefined)
          }
          flatten={false}
        >
          {loading ? <ContextualFloatingButtonLoadingIndicator /> : null}
          <ContextualFloatingButtonContent isIconOnly={layout === "iconOnly"}>
            {children}
          </ContextualFloatingButtonContent>
        </ContextualFloatingButtonRoot>
      </IconRequired>
    );
  },
);
ContextualFloatingButton.displayName = "ContextualFloatingButton";
