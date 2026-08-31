import * as React from "@lynx-js/react";
import { isValidElement, type ReactElement } from "@lynx-js/react";
import clsx from "clsx";

import { selectBox, type SelectBoxVariantProps } from "@seed-design/lynx-css/recipes/select-box";
import {
  selectBoxCheckmark,
  type SelectBoxCheckmarkVariantProps,
} from "@seed-design/lynx-css/recipes/select-box-checkmark";
import {
  selectBoxGroup,
  type SelectBoxGroupVariantProps,
} from "@seed-design/lynx-css/recipes/select-box-group";

import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import type {
  LynxAccessibilityProps,
  LynxIconElementProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewRef,
} from "../../types";
import { InternalIcon } from "../Icon/Icon";

interface GroupContextValue {
  layout: NonNullable<SelectBoxVariantProps["layout"]>;
}

const GroupContext = React.createContext<GroupContextValue>({ layout: "horizontal" });

interface ItemContextValue {
  checked: boolean;
  disabled: boolean;
  pressed: boolean;
  classNames: ReturnType<typeof selectBox>;
  footerVisibility: "when-selected" | "when-not-selected" | "always";
}

const ItemContext = React.createContext<ItemContextValue | null>(null);

function useItemContext(consumer: string): ItemContextValue {
  const context = React.useContext(ItemContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <CheckSelectBoxRoot/>.`);
  return context;
}

export interface CheckSelectBoxGroupProps
  extends SelectBoxGroupVariantProps,
    LynxStyledElementProps,
    LynxAccessibilityProps {
  /** @default "1" */
  columns?: "1" | "2";
}

export const CheckSelectBoxGroup = React.forwardRef<unknown, CheckSelectBoxGroupProps>(
  (props, ref) => {
    const [variantProps, restProps] = selectBoxGroup.splitVariantProps(props);
    const { children, className, ...nativeProps } = restProps;
    const columns = variantProps.columns ?? "1";
    const layout = columns === "1" ? "horizontal" : "vertical";

    return (
      <GroupContext.Provider value={{ layout }}>
        <view
          {...(ref ? { ref: ref as LynxViewRef } : {})}
          className={clsx(selectBoxGroup({ ...variantProps, columns }), className)}
          {...nativeProps}
        >
          {children}
        </view>
      </GroupContext.Provider>
    );
  },
);
CheckSelectBoxGroup.displayName = "CheckSelectBoxGroup";

export interface CheckSelectBoxRootProps
  extends SelectBoxVariantProps,
    LynxStyledElementProps,
    LynxAccessibilityProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** @default "when-selected" */
  footerVisibility?: "when-selected" | "when-not-selected" | "always";
}

export const CheckSelectBoxRoot = React.forwardRef<unknown, CheckSelectBoxRootProps>(
  (props, ref) => {
    const [variantProps, restProps] = selectBox.splitVariantProps(props);
    const {
      children,
      className,
      checked: checkedProp,
      defaultChecked = false,
      onCheckedChange,
      footerVisibility = "when-selected",
      ...nativeProps
    } = restProps;
    const group = React.useContext(GroupContext);
    const disabled = variantProps.disabled ?? false;
    const [checked, setChecked] = useControllableState({
      value: checkedProp,
      defaultValue: defaultChecked,
      onChange: onCheckedChange,
    });
    const { pressed, ...pressHandlers } = usePressTap({
      disabled,
      onTap: () => setChecked(!checked),
    });
    const classNames = selectBox({
      layout: group.layout,
      ...variantProps,
      selected: checked,
      pressed,
      disabled,
    });
    const contextValue = React.useMemo<ItemContextValue>(
      () => ({ checked, disabled, pressed, classNames, footerVisibility }),
      [checked, disabled, pressed, classNames, footerVisibility],
    );

    return (
      <ItemContext.Provider value={contextValue}>
        <view
          {...(ref ? { ref: ref as LynxViewRef } : {})}
          className={clsx(classNames.root, className)}
          accessibility-element={true}
          accessibility-role-description="checkbox"
          accessibility-value={checked ? "checked" : "unchecked"}
          accessibility-traits={disabled ? "disabled" : "button"}
          {...nativeProps}
          {...pressHandlers}
        >
          {children}
        </view>
      </ItemContext.Provider>
    );
  },
);
CheckSelectBoxRoot.displayName = "CheckSelectBoxRoot";

function createViewSlot(slot: "trigger" | "content" | "body" | "footer", displayName: string) {
  const Component = React.forwardRef<unknown, LynxStyledElementProps>((props, ref) => {
    const { children, className, ...nativeProps } = props;
    const context = useItemContext(displayName);
    if (
      slot === "footer" &&
      context.footerVisibility !== "always" &&
      (context.footerVisibility === "when-selected") !== context.checked
    ) {
      return null;
    }

    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        className={clsx(context.classNames[slot], className)}
        {...nativeProps}
      >
        {children}
      </view>
    );
  });
  Component.displayName = displayName;
  return Component;
}

function createTextSlot(slot: "label" | "description", displayName: string) {
  const Component = React.forwardRef<unknown, LynxStyledElementProps>((props, ref) => {
    const { children, className, ...nativeProps } = props;
    const context = useItemContext(displayName);
    return (
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        className={clsx(context.classNames[slot], className)}
        {...nativeProps}
      >
        {children}
      </text>
    );
  });
  Component.displayName = displayName;
  return Component;
}

export interface CheckSelectBoxCheckmarkControlProps
  extends SelectBoxCheckmarkVariantProps,
    LynxStyledElementProps {}

export const CheckSelectBoxCheckmarkControl = React.forwardRef<
  unknown,
  CheckSelectBoxCheckmarkControlProps
>((props, ref) => {
  const [variantProps, restProps] = selectBoxCheckmark.splitVariantProps(props);
  const { children, className, ...nativeProps } = restProps;
  const context = useItemContext("CheckSelectBoxCheckmarkControl");
  const classes = selectBoxCheckmark({
    ...variantProps,
    selected: context.checked,
    pressed: context.pressed,
    disabled: context.disabled,
  });

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classes.root, className)}
      {...nativeProps}
    >
      {children}
    </view>
  );
});
CheckSelectBoxCheckmarkControl.displayName = "CheckSelectBoxCheckmarkControl";

export interface CheckSelectBoxCheckmarkIconProps
  extends Pick<LynxStyledElementProps, "className" | "style"> {
  icon: ReactElement<LynxIconElementProps>;
}

export function CheckSelectBoxCheckmarkIcon(props: CheckSelectBoxCheckmarkIconProps) {
  const { icon, className, style } = props;
  const context = useItemContext("CheckSelectBoxCheckmarkIcon");
  if (!isValidElement<LynxIconElementProps>(icon)) return null;

  const classes = selectBoxCheckmark({
    selected: context.checked,
    pressed: context.pressed,
    disabled: context.disabled,
  });

  return (
    <InternalIcon
      icon={icon}
      className={clsx(classes.icon, className)}
      style={style}
      deps={[context.checked, context.pressed, context.disabled]}
    />
  );
}
CheckSelectBoxCheckmarkIcon.displayName = "CheckSelectBoxCheckmarkIcon";

export const CheckSelectBoxTrigger = createViewSlot("trigger", "CheckSelectBoxTrigger");
export const CheckSelectBoxContent = createViewSlot("content", "CheckSelectBoxContent");
export const CheckSelectBoxBody = createViewSlot("body", "CheckSelectBoxBody");
export const CheckSelectBoxLabel = createTextSlot("label", "CheckSelectBoxLabel");
export const CheckSelectBoxDescription = createTextSlot("description", "CheckSelectBoxDescription");
export const CheckSelectBoxFooter = createViewSlot("footer", "CheckSelectBoxFooter");

export type CheckSelectBoxTriggerProps = LynxStyledElementProps;
export type CheckSelectBoxContentProps = LynxStyledElementProps;
export type CheckSelectBoxBodyProps = LynxStyledElementProps;
export type CheckSelectBoxLabelProps = LynxStyledElementProps;
export type CheckSelectBoxDescriptionProps = LynxStyledElementProps;
export type CheckSelectBoxFooterProps = LynxStyledElementProps;
