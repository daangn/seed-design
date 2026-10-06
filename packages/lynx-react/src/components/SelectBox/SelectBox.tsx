import * as React from "@lynx-js/react";
import clsx from "clsx";

import { selectBox, type SelectBoxVariantProps } from "@seed-design/lynx-css/recipes/select-box";
import {
  selectBoxCheckmark,
  type SelectBoxCheckmarkVariantProps,
} from "@seed-design/lynx-css/recipes/select-box-checkmark";
import { selectBoxGroup } from "@seed-design/lynx-css/recipes/select-box-group";
import {
  CheckboxProvider,
  useCheckbox,
  type UseCheckboxProps,
} from "@seed-design/lynx-react-checkbox";
import {
  CollapsibleProvider,
  useCollapsible,
  useCollapsibleContext,
  type UseCollapsibleReturn,
} from "@seed-design/lynx-react-collapsible";
import {
  RadioGroupItemProvider,
  useRadioGroupItem,
  type UseRadioGroupItemProps,
} from "@seed-design/lynx-react-radio-group";
import { useScaleFeedback, type ScaleFeedbackTargetProps } from "../../hooks/useScaleFeedback";
import { ScaleFeedbackContentContext } from "../../contexts";

import type {
  LynxAccessibilityProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewRef,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { IconSlotProvider, InternalIcon, type InternalIconProps } from "../Icon/Icon";
import { mergeProps } from "../../utils/merge-props";

/**
 * @platform Lynx
 *
 * 선택 상태·press·접근성은 `@seed-design/lynx-react-checkbox`와
 * `@seed-design/lynx-react-radio-group`, footer 접힘·높이 측정은
 * `@seed-design/lynx-react-collapsible`이 담당한다. 이 파일은 선택 surface와 content/footer 배치,
 * SEED recipe·Scale Feedback을 조립한다.
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
type SelectBoxAccessibilityStateProps = Pick<
  LynxAccessibilityProps,
  | "accessibility-element"
  | "accessibility-role-description"
  | "accessibility-traits"
  | "accessibility-value"
>;

interface SelectBoxStateContextValue {
  selected: boolean;
  pressed: boolean;
  disabled: boolean;
}

const SelectBoxStateContext = React.createContext<SelectBoxStateContextValue | null>(null);
const SelectBoxLayoutContext = React.createContext<PublicSelectBoxVariantProps>({});
const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(selectBox);

function useSelectBoxStateContext(consumer: string): SelectBoxStateContextValue {
  const context = React.useContext(SelectBoxStateContext);
  if (!context) {
    throw new Error(`<${consumer}/> must be rendered inside a SelectBox root or item.`);
  }
  return context;
}

function useResolvedVariantProps(
  variantProps: PublicSelectBoxVariantProps,
): PublicSelectBoxVariantProps {
  const inheritedVariantProps = React.useContext(SelectBoxLayoutContext);
  return { ...variantProps, layout: variantProps.layout ?? inheritedVariantProps.layout };
}

/** `always`가 아니면 선택 상태에 따라 여닫는 footer Collapsible을 반환합니다. */
function useFooterCollapsible(
  selected: boolean,
  footerVisibility: FooterVisibility,
): UseCollapsibleReturn | null {
  const collapsible = useCollapsible({
    open: footerVisibility === "when-not-selected" ? !selected : selected,
  });
  return footerVisibility === "always" ? null : collapsible;
}

interface SelectBoxSurfaceOptions extends LynxStyledElementProps {
  ref: React.ForwardedRef<unknown>;
  variantProps: PublicSelectBoxVariantProps;
  state: SelectBoxStateContextValue;
  /** tap·Scale Feedback trigger handler. 선택 영역 전체를 덮는 interaction root에 붙습니다. */
  interactionProps: object;
  /** headless 접근성 기본값과 사용자 접근성 props. 선택 surface에 붙습니다. */
  accessibilityProps: LynxAccessibilityProps;
  scaleFeedbackTargetProps: ScaleFeedbackTargetProps;
  footerCollapsible: UseCollapsibleReturn | null;
}

function renderSelectBoxSurface(options: SelectBoxSurfaceOptions) {
  const { ref, children, className, style, variantProps, state, footerCollapsible } = options;
  const classes = selectBox({
    ...variantProps,
    ...state,
    footerOpen: footerCollapsible ? footerCollapsible.open : true,
  });
  const content = (
    <ScaleFeedbackContentContext.Provider value={true}>
      {children}
    </ScaleFeedbackContentContext.Provider>
  );

  return (
    <SelectBoxStateContext.Provider value={state}>
      <ClassNamesProvider value={classes}>
        <IconSlotProvider
          value={{
            classNames: { prefixIcon: classes.prefixIcon },
            deps: [state.selected, state.pressed, state.disabled],
          }}
        >
          <view
            {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, options.interactionProps)}
            className={selectBox(variantProps).interactionRoot}
            accessibility-element={false}
          >
            <view
              className={clsx(classes.root, className)}
              style={style}
              {...options.accessibilityProps}
            >
              <view className={classes.scaleContent} {...options.scaleFeedbackTargetProps}>
                {footerCollapsible ? (
                  <CollapsibleProvider value={footerCollapsible}>{content}</CollapsibleProvider>
                ) : (
                  content
                )}
              </view>
              <view className={classes.selectedStroke} accessibility-elements-hidden={true} />
            </view>
          </view>
        </IconSlotProvider>
      </ClassNamesProvider>
    </SelectBoxStateContext.Provider>
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
        {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
        className={clsx(classes, className)}
        style={{ ...style, gridTemplateColumns: `repeat(${columns}, 1fr)` }}
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
      UseCheckboxProps,
      "checked" | "defaultChecked" | "indeterminate" | "disabled" | "onCheckedChange"
    > {
  /** @default "when-selected" */
  footerVisibility?: FooterVisibility;
}

/**
 * Checkbox 선택 상태를 가진 Select Box입니다. 하위 요소는 `useCheckboxContext`로 선택 상태를 읽습니다.
 */
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
      "accessibility-element": accessibilityElement,
      "accessibility-role-description": accessibilityRoleDescription,
      "accessibility-traits": accessibilityTraits,
      "accessibility-value": accessibilityValue,
      ...restProps
    } = props;
    const [variantProps, accessibilityProps] = selectBox.splitVariantProps(restProps);
    const api = useCheckbox({
      checked,
      defaultChecked,
      indeterminate,
      disabled,
      onCheckedChange,
      "accessibility-element": accessibilityElement,
      "accessibility-role-description": accessibilityRoleDescription,
      "accessibility-traits": accessibilityTraits,
      "accessibility-value": accessibilityValue,
    });
    // Scale Feedback owns the Main Thread touch handlers and forwards press state to Background.
    const { bindtap, bindtouchstart, bindtouchend, bindtouchcancel, ...stateAccessibilityProps } =
      api.rootProps;
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
      disabled: api.disabled,
      onTouchStart: bindtouchstart,
      onTouchEnd: bindtouchend,
      onTouchCancel: bindtouchcancel,
    });
    const state = React.useMemo(
      () => ({ selected: api.checked, pressed: api.pressed, disabled: api.disabled }),
      [api.checked, api.pressed, api.disabled],
    );
    const resolvedVariantProps = useResolvedVariantProps(variantProps);
    const footerCollapsible = useFooterCollapsible(api.checked, footerVisibility);

    return (
      <CheckboxProvider value={api}>
        {renderSelectBoxSurface({
          ref,
          children,
          className,
          style,
          variantProps: resolvedVariantProps,
          state,
          interactionProps: mergeProps(scaleFeedbackTriggerProps, { bindtap }),
          accessibilityProps: { ...stateAccessibilityProps, ...accessibilityProps },
          scaleFeedbackTargetProps,
          footerCollapsible,
        })}
      </CheckboxProvider>
    );
  },
);
CheckSelectBoxRoot.displayName = "CheckSelectBoxRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface RadioSelectBoxItemProps
  extends PublicSelectBoxVariantProps,
    LynxStyledElementProps,
    LynxAccessibilityProps,
    Pick<UseRadioGroupItemProps, "value" | "disabled"> {
  /** @default "when-selected" */
  footerVisibility?: FooterVisibility;
}

/**
 * RadioGroup Item 선택 상태를 가진 Select Box입니다. 선택 값은 `RadioGroupField.Root`나
 * headless `RadioGroup.Root`가 소유하고, 하위 요소는 `useRadioGroupItemContext`로 선택 상태를 읽습니다.
 */
export const RadioSelectBoxItem = React.forwardRef<unknown, RadioSelectBoxItemProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      value,
      disabled,
      footerVisibility = "when-selected",
      "accessibility-element": accessibilityElement,
      "accessibility-role-description": accessibilityRoleDescription,
      "accessibility-traits": accessibilityTraits,
      "accessibility-value": accessibilityValue,
      ...restProps
    } = props;
    const [variantProps, accessibilityProps] = selectBox.splitVariantProps(restProps);
    const api = useRadioGroupItem({
      value,
      disabled,
      "accessibility-element": accessibilityElement,
      "accessibility-role-description": accessibilityRoleDescription,
      "accessibility-traits": accessibilityTraits,
      "accessibility-value": accessibilityValue,
    });
    const {
      "accessibility-element": itemAccessibilityElement,
      "accessibility-role-description": itemAccessibilityRoleDescription,
      "accessibility-traits": itemAccessibilityTraits,
      "accessibility-value": itemAccessibilityValue,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      ...tapProps
    } = api.itemProps;
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
      disabled: api.disabled,
      onTouchStart: bindtouchstart,
      onTouchEnd: bindtouchend,
      onTouchCancel: bindtouchcancel,
    });
    const state = React.useMemo(
      () => ({ selected: api.checked, pressed: api.pressed, disabled: api.disabled }),
      [api.checked, api.pressed, api.disabled],
    );
    const resolvedVariantProps = useResolvedVariantProps(variantProps);
    const footerCollapsible = useFooterCollapsible(api.checked, footerVisibility);
    const stateAccessibilityProps: SelectBoxAccessibilityStateProps = {
      "accessibility-element": itemAccessibilityElement,
      "accessibility-role-description": itemAccessibilityRoleDescription,
      "accessibility-traits": itemAccessibilityTraits,
      "accessibility-value": itemAccessibilityValue,
    };

    return (
      <RadioGroupItemProvider value={api}>
        {renderSelectBoxSurface({
          ref,
          children,
          className,
          style,
          variantProps: resolvedVariantProps,
          state,
          interactionProps: mergeProps(scaleFeedbackTriggerProps, tapProps),
          accessibilityProps: { ...stateAccessibilityProps, ...accessibilityProps },
          scaleFeedbackTargetProps,
          footerCollapsible,
        })}
      </RadioGroupItemProvider>
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
        {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
        className={clsx(classes[slot], className)}
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
        {...mergeProps(ref ? { ref: ref as LynxTextRef } : {}, nativeProps)}
        className={clsx(classes[slot], className)}
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
        {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
        className={clsx(classes.label, className)}
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

const SelectBoxFooter = React.forwardRef<unknown, SelectBoxFooterProps>((props, ref) => {
  const {
    children,
    className,
    style,
    "accessibility-elements-hidden": accessibilityElementsHidden = false,
    ...nativeProps
  } = props;
  const classes = useClassNames();
  // `footerVisibility="always"`이면 Collapsible이 없다. recipe의 기본 높이가 0이므로 auto로 연다.
  const collapsible = useCollapsibleContext({ strict: false });

  return (
    <view
      {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
      className={clsx(classes.footer, className)}
      style={{ ...style, ...(collapsible ? collapsible.contentProps.style : { height: "auto" }) }}
      accessibility-elements-hidden={
        (collapsible?.contentProps["accessibility-elements-hidden"] ?? false) ||
        accessibilityElementsHidden
      }
    >
      <view className={classes.footerInner} {...collapsible?.contentInnerProps}>
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
  const context = useSelectBoxStateContext("CheckSelectBoxCheckmarkControl");
  const variantProps = {
    selected: context.selected,
    pressed: context.pressed,
    disabled: context.disabled,
  };
  const classes = selectBoxCheckmark(variantProps);

  return (
    <SelectBoxCheckmarkContext.Provider value={{ iconClassName: classes.icon, variantProps }}>
      <view
        {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
        className={clsx(classes.root, className)}
        accessibility-elements-hidden={true}
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
      {...mergeProps({ ref }, otherProps)}
      className={clsx(context.iconClassName, className)}
      deps={[
        context.variantProps.selected,
        context.variantProps.pressed,
        context.variantProps.disabled,
      ]}
    />
  );
});
CheckSelectBoxCheckmarkIcon.displayName = "CheckSelectBoxCheckmarkIcon";
