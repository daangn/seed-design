import * as React from "@lynx-js/react";
import clsx from "clsx";

import { selectBox, type SelectBoxVariantProps } from "@seed-design/lynx-css/recipes/select-box";
import {
  selectBoxCheckmark,
  type SelectBoxCheckmarkVariantProps,
} from "@seed-design/lynx-css/recipes/select-box-checkmark";
import { selectBoxGroup } from "@seed-design/lynx-css/recipes/select-box-group";

import type {
  LynxAccessibilityProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewProps,
  LynxViewRef,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { CheckboxRoot, type CheckboxRootProps, useCheckboxContext } from "../Checkbox/Checkbox";
import { IconSlotProvider, InternalIcon, type InternalIconProps } from "../Icon/Icon";
import {
  RadioGroupItem,
  type RadioGroupItemProps,
  useRadioGroupItemContext,
} from "../RadioGroup/RadioGroup";

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - HiddenInput / name / required / invalid: Lynx에 native form 제출 모델이 없음
 * - focus / focusVisible: Lynx에 키보드 포커스 개념이 없음
 * - DOM field wrapper: Lynx Registry는 label/error 연결용 wrapper를 제공하지 않음
 */

type FooterVisibility = "when-selected" | "when-not-selected" | "always";
type PublicSelectBoxVariantProps = Omit<
  SelectBoxVariantProps,
  "selected" | "pressed" | "disabled" | "footerOpen"
>;

interface SelectBoxRuntimeContextValue {
  selected: boolean;
  pressed: boolean;
  disabled: boolean;
  footerVisibility: FooterVisibility;
  variantProps: PublicSelectBoxVariantProps;
  accessibilityRole: "checkbox" | "radio";
}

const SelectBoxRuntimeContext = React.createContext<SelectBoxRuntimeContextValue | null>(null);
const SelectBoxLayoutContext = React.createContext<PublicSelectBoxVariantProps>({});
const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(selectBox);

function useSelectBoxRuntimeContext(consumer: string): SelectBoxRuntimeContextValue {
  const context = React.useContext(SelectBoxRuntimeContext);
  if (!context) {
    throw new Error(`<${consumer}/> must be rendered inside a SelectBox root or item.`);
  }
  return context;
}

interface SelectBoxSurfaceProps extends LynxStyledElementProps {
  accessibilityProps: LynxAccessibilityProps;
}

function SelectBoxSurface({
  children,
  className,
  style,
  accessibilityProps,
}: SelectBoxSurfaceProps) {
  const context = useSelectBoxRuntimeContext("SelectBoxSurface");
  const footerOpen =
    context.footerVisibility === "always" ||
    (context.footerVisibility === "when-selected" ? context.selected : !context.selected);
  const classes = selectBox({
    ...context.variantProps,
    selected: context.selected,
    pressed: context.pressed,
    disabled: context.disabled,
    footerOpen,
  });

  return (
    <ClassNamesProvider value={classes}>
      <IconSlotProvider
        value={{
          classNames: { prefixIcon: classes.prefixIcon },
          deps: [context.selected, context.pressed, context.disabled],
        }}
      >
        <view
          className={clsx(classes.root, className)}
          style={style}
          accessibility-element={true}
          accessibility-role-description={context.accessibilityRole}
          accessibility-value={context.selected ? "selected" : "not selected"}
          accessibility-traits={context.disabled ? "disabled" : undefined}
          {...accessibilityProps}
        >
          {children}
          <view className={classes.selectedStroke} accessibility-elements-hidden={true} />
        </view>
      </IconSlotProvider>
    </ClassNamesProvider>
  );
}

////////////////////////////////////////////////////////////////////////////////////

export interface SelectBoxGroupProps extends LynxStyledElementProps {
  /**
   * 열 개수입니다. 2 이상이면 자식 Select Box의 기본 layout이 vertical이 됩니다.
   * @default 1
   */
  columns?: number;
}

const SelectBoxGroup = React.forwardRef<unknown, SelectBoxGroupProps>((props, ref) => {
  const { children, columns = 1, className, style, ...nativeProps } = props;
  const classes = selectBoxGroup({ multiColumn: columns > 1 });
  const layout: PublicSelectBoxVariantProps["layout"] = columns > 1 ? "vertical" : "horizontal";

  return (
    <SelectBoxLayoutContext.Provider value={{ layout }}>
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        className={clsx(classes, className)}
        style={{ ...style, gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        {...nativeProps}
      >
        {children}
      </view>
    </SelectBoxLayoutContext.Provider>
  );
});
SelectBoxGroup.displayName = "SelectBoxGroup";

export interface CheckSelectBoxGroupProps extends SelectBoxGroupProps {}
export const CheckSelectBoxGroup = SelectBoxGroup;

export interface RadioSelectBoxGroupProps extends SelectBoxGroupProps {}
export const RadioSelectBoxGroup = SelectBoxGroup;

////////////////////////////////////////////////////////////////////////////////////

export interface CheckSelectBoxRootProps
  extends PublicSelectBoxVariantProps,
    LynxStyledElementProps,
    LynxAccessibilityProps,
    Pick<
      CheckboxRootProps,
      "checked" | "defaultChecked" | "indeterminate" | "disabled" | "onCheckedChange"
    > {
  /** @default "when-selected" */
  footerVisibility?: FooterVisibility;
}

interface CheckSelectBoxSurfaceProps extends SelectBoxSurfaceProps {
  footerVisibility: FooterVisibility;
  variantProps: PublicSelectBoxVariantProps;
}

function CheckSelectBoxSurface(props: CheckSelectBoxSurfaceProps) {
  const checkbox = useCheckboxContext("CheckSelectBoxRoot");
  const contextValue = React.useMemo<SelectBoxRuntimeContextValue>(
    () => ({
      selected: checkbox.checked,
      pressed: checkbox.pressed,
      disabled: checkbox.disabled,
      footerVisibility: props.footerVisibility,
      variantProps: props.variantProps,
      accessibilityRole: "checkbox",
    }),
    [
      checkbox.checked,
      checkbox.disabled,
      checkbox.pressed,
      props.footerVisibility,
      props.variantProps,
    ],
  );

  return (
    <SelectBoxRuntimeContext.Provider value={contextValue}>
      <SelectBoxSurface {...props} />
    </SelectBoxRuntimeContext.Provider>
  );
}

export const CheckSelectBoxRoot = React.forwardRef<unknown, CheckSelectBoxRootProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      checked,
      defaultChecked,
      indeterminate,
      disabled,
      onCheckedChange,
      footerVisibility = "when-selected",
      ...restProps
    } = props;
    const inheritedVariantProps = React.useContext(SelectBoxLayoutContext);
    const [variantProps, accessibilityProps] = selectBox.splitVariantProps(restProps);
    const resolvedVariantProps = {
      ...variantProps,
      layout: variantProps.layout ?? inheritedVariantProps.layout,
    };
    const interactionRootClassName = selectBox(resolvedVariantProps).interactionRoot;

    return (
      <CheckboxRoot
        ref={ref}
        className={interactionRootClassName}
        checked={checked}
        defaultChecked={defaultChecked}
        indeterminate={indeterminate}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        accessibility-element={false}
      >
        <CheckSelectBoxSurface
          className={className}
          style={style}
          footerVisibility={footerVisibility}
          variantProps={resolvedVariantProps}
          accessibilityProps={accessibilityProps}
        >
          {children}
        </CheckSelectBoxSurface>
      </CheckboxRoot>
    );
  },
);
CheckSelectBoxRoot.displayName = "CheckSelectBoxRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface RadioSelectBoxItemProps
  extends PublicSelectBoxVariantProps,
    LynxStyledElementProps,
    LynxAccessibilityProps,
    Pick<RadioGroupItemProps, "value" | "disabled"> {
  /** @default "when-selected" */
  footerVisibility?: FooterVisibility;
}

interface RadioSelectBoxSurfaceProps extends SelectBoxSurfaceProps {
  footerVisibility: FooterVisibility;
  variantProps: PublicSelectBoxVariantProps;
}

function RadioSelectBoxSurface(props: RadioSelectBoxSurfaceProps) {
  const item = useRadioGroupItemContext("RadioSelectBoxItem");
  const contextValue = React.useMemo<SelectBoxRuntimeContextValue>(
    () => ({
      selected: item.checked,
      pressed: item.pressed,
      disabled: item.disabled,
      footerVisibility: props.footerVisibility,
      variantProps: props.variantProps,
      accessibilityRole: "radio",
    }),
    [item.checked, item.disabled, item.pressed, props.footerVisibility, props.variantProps],
  );

  return (
    <SelectBoxRuntimeContext.Provider value={contextValue}>
      <SelectBoxSurface {...props} />
    </SelectBoxRuntimeContext.Provider>
  );
}

export const RadioSelectBoxItem = React.forwardRef<unknown, RadioSelectBoxItemProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      value,
      disabled,
      footerVisibility = "when-selected",
      ...restProps
    } = props;
    const inheritedVariantProps = React.useContext(SelectBoxLayoutContext);
    const [variantProps, accessibilityProps] = selectBox.splitVariantProps(restProps);
    const resolvedVariantProps = {
      ...variantProps,
      layout: variantProps.layout ?? inheritedVariantProps.layout,
    };
    const interactionRootClassName = selectBox(resolvedVariantProps).interactionRoot;

    return (
      <RadioGroupItem
        ref={ref}
        className={interactionRootClassName}
        value={value}
        disabled={disabled}
        accessibility-element={false}
      >
        <RadioSelectBoxSurface
          className={className}
          style={style}
          footerVisibility={footerVisibility}
          variantProps={resolvedVariantProps}
          accessibilityProps={accessibilityProps}
        >
          {children}
        </RadioSelectBoxSurface>
      </RadioGroupItem>
    );
  },
);
RadioSelectBoxItem.displayName = "RadioSelectBoxItem";

////////////////////////////////////////////////////////////////////////////////////

function createViewSlot(displayName: string, slot: keyof ReturnType<typeof selectBox>) {
  const Component = React.forwardRef<unknown, LynxStyledElementProps>((props, ref) => {
    const { children, className, ...nativeProps } = props;
    const classes = useClassNames();

    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        className={clsx(classes[slot], className)}
        {...nativeProps}
      >
        {children}
      </view>
    );
  });
  Component.displayName = displayName;
  return Component;
}

function createTextSlot(displayName: string, slot: keyof ReturnType<typeof selectBox>) {
  const Component = React.forwardRef<unknown, LynxStyledElementProps>((props, ref) => {
    const { children, className, ...nativeProps } = props;
    const classes = useClassNames();

    return (
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        className={clsx(classes[slot], className)}
        {...nativeProps}
      >
        {children}
      </text>
    );
  });
  Component.displayName = displayName;
  return Component;
}

function createLabelSlot(displayName: string) {
  const Component = React.forwardRef<unknown, LynxStyledElementProps>((props, ref) => {
    const { children, className, ...nativeProps } = props;
    const classes = useClassNames();
    const labelChildren =
      typeof children === "string" || typeof children === "number" ? (
        <text>{children}</text>
      ) : (
        children
      );

    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        className={clsx(classes.label, className)}
        {...nativeProps}
      >
        {labelChildren}
      </view>
    );
  });
  Component.displayName = displayName;
  return Component;
}

export interface CheckSelectBoxTriggerProps extends LynxStyledElementProps {}
export const CheckSelectBoxTrigger = createViewSlot("CheckSelectBoxTrigger", "trigger");
export interface CheckSelectBoxContentProps extends LynxStyledElementProps {}
export const CheckSelectBoxContent = createViewSlot("CheckSelectBoxContent", "content");
export interface CheckSelectBoxBodyProps extends LynxStyledElementProps {}
export const CheckSelectBoxBody = createViewSlot("CheckSelectBoxBody", "body");
export interface CheckSelectBoxLabelProps extends LynxStyledElementProps {}
export const CheckSelectBoxLabel = createLabelSlot("CheckSelectBoxLabel");
export interface CheckSelectBoxDescriptionProps extends LynxStyledElementProps {}
export const CheckSelectBoxDescription = createTextSlot("CheckSelectBoxDescription", "description");

export interface RadioSelectBoxTriggerProps extends LynxStyledElementProps {}
export const RadioSelectBoxTrigger = createViewSlot("RadioSelectBoxTrigger", "trigger");
export interface RadioSelectBoxContentProps extends LynxStyledElementProps {}
export const RadioSelectBoxContent = createViewSlot("RadioSelectBoxContent", "content");
export interface RadioSelectBoxBodyProps extends LynxStyledElementProps {}
export const RadioSelectBoxBody = createViewSlot("RadioSelectBoxBody", "body");
export interface RadioSelectBoxLabelProps extends LynxStyledElementProps {}
export const RadioSelectBoxLabel = createLabelSlot("RadioSelectBoxLabel");
export interface RadioSelectBoxDescriptionProps extends LynxStyledElementProps {}
export const RadioSelectBoxDescription = createTextSlot("RadioSelectBoxDescription", "description");

////////////////////////////////////////////////////////////////////////////////////

export interface SelectBoxFooterProps extends LynxStyledElementProps, LynxAccessibilityProps {}

type FooterLayoutChangeHandler = NonNullable<LynxViewProps["bindlayoutchange"]>;

function getFooterLayoutHeight(event: Parameters<FooterLayoutChangeHandler>[0]): number | null {
  const eventWithHeight = event as Parameters<FooterLayoutChangeHandler>[0] & { height?: number };
  const height = event.detail?.height ?? event.params?.height ?? eventWithHeight.height;
  if (typeof height !== "number" || !Number.isFinite(height)) return null;
  return Math.max(0, height);
}

const SelectBoxFooter = React.forwardRef<unknown, SelectBoxFooterProps>((props, ref) => {
  const {
    children,
    className,
    style,
    "accessibility-elements-hidden": accessibilityElementsHidden = false,
    ...nativeProps
  } = props;
  const context = useSelectBoxRuntimeContext("SelectBoxFooter");
  const classes = useClassNames();
  const [contentHeight, setContentHeight] = React.useState(0);
  const open =
    context.footerVisibility === "always" ||
    (context.footerVisibility === "when-selected" ? context.selected : !context.selected);
  const handleLayoutChange = React.useCallback<FooterLayoutChangeHandler>((event) => {
    const height = getFooterLayoutHeight(event);
    if (height !== null) setContentHeight((current) => (current === height ? current : height));
  }, []);

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classes.footer, className)}
      style={{
        ...style,
        height:
          context.footerVisibility === "always" || (open && contentHeight === 0)
            ? "auto"
            : open
              ? `${contentHeight}px`
              : "0px",
      }}
      accessibility-elements-hidden={!open || accessibilityElementsHidden}
      {...nativeProps}
    >
      <view className={classes.footerInner} bindlayoutchange={handleLayoutChange}>
        {children}
      </view>
    </view>
  );
});
SelectBoxFooter.displayName = "SelectBoxFooter";

export interface CheckSelectBoxFooterProps extends SelectBoxFooterProps {}
export const CheckSelectBoxFooter = SelectBoxFooter;
export interface RadioSelectBoxFooterProps extends SelectBoxFooterProps {}
export const RadioSelectBoxFooter = SelectBoxFooter;

////////////////////////////////////////////////////////////////////////////////////

interface SelectBoxCheckmarkContextValue {
  iconClassName: string;
  variantProps: SelectBoxCheckmarkVariantProps;
}

const SelectBoxCheckmarkContext = React.createContext<SelectBoxCheckmarkContextValue | null>(null);

export interface CheckSelectBoxCheckmarkControlProps extends LynxStyledElementProps {}

export const CheckSelectBoxCheckmarkControl = React.forwardRef<
  unknown,
  CheckSelectBoxCheckmarkControlProps
>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useSelectBoxRuntimeContext("CheckSelectBoxCheckmarkControl");
  const variantProps = {
    selected: context.selected,
    pressed: context.pressed,
    disabled: context.disabled,
  };
  const classes = selectBoxCheckmark(variantProps);

  return (
    <SelectBoxCheckmarkContext.Provider value={{ iconClassName: classes.icon, variantProps }}>
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        className={clsx(classes.root, className)}
        accessibility-elements-hidden={true}
        {...nativeProps}
      >
        {children}
      </view>
    </SelectBoxCheckmarkContext.Provider>
  );
});
CheckSelectBoxCheckmarkControl.displayName = "CheckSelectBoxCheckmarkControl";

export interface CheckSelectBoxCheckmarkIconProps extends Omit<InternalIconProps, "deps"> {}

export const CheckSelectBoxCheckmarkIcon = React.forwardRef<
  unknown,
  CheckSelectBoxCheckmarkIconProps
>((props, ref) => {
  const { className, ...otherProps } = props;
  const context = React.useContext(SelectBoxCheckmarkContext);
  if (!context) {
    throw new Error(
      "<CheckSelectBoxCheckmarkIcon/> must be rendered inside <CheckSelectBoxCheckmarkControl/>.",
    );
  }

  return (
    <InternalIcon
      ref={ref}
      className={clsx(context.iconClassName, className)}
      deps={[
        context.variantProps.selected,
        context.variantProps.pressed,
        context.variantProps.disabled,
      ]}
      {...otherProps}
    />
  );
});
CheckSelectBoxCheckmarkIcon.displayName = "CheckSelectBoxCheckmarkIcon";
