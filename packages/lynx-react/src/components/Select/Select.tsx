import * as React from "@lynx-js/react";
import { isValidElement } from "@lynx-js/react";
import clsx from "clsx";

import { select, type SelectVariantProps } from "@seed-design/lynx-css/recipes/select";
import {
  selectTrigger,
  type SelectTriggerVariantProps,
} from "@seed-design/lynx-css/recipes/select-trigger";
import { selectItem, type SelectItemVariantProps } from "@seed-design/lynx-css/recipes/select-item";
import { select as selectVars } from "@seed-design/lynx-css/vars/component";
import { useFieldContext } from "@seed-design/lynx-react-field";
import {
  SelectContent as SelectContentPrimitive,
  SelectGroup as SelectGroupPrimitive,
  SelectGroupLabel as SelectGroupLabelPrimitive,
  SelectItemProvider,
  SelectPlaceholder as SelectPlaceholderPrimitive,
  SelectPositioner as SelectPositionerPrimitive,
  SelectProvider,
  SelectScrollArea as SelectScrollAreaPrimitive,
  SelectValue as SelectValuePrimitive,
  useSelect,
  useSelectContext,
  useSelectItem,
  useSelectItemContext,
  useSelectTrigger,
  type SelectPositionerProps as SelectPositionerPrimitiveProps,
  type UseSelectProps,
} from "@seed-design/lynx-react-select";

import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type {
  LynxHostProps,
  LynxIconElementProps,
  LynxTextRef,
  LynxViewProps,
  LynxViewRef,
} from "../../types";
import { toArray } from "../../utils/children";
import { mergeProps } from "../../utils/merge-props";
import { InternalIcon, type InternalIconProps } from "../Icon/Icon";

export type {
  SelectOpenChangeDetails,
  SelectOpenChangeReason,
  SelectSelectedItem,
} from "@seed-design/lynx-react-select";

// 목록 최대 높이 token(px)을 위치 계산에 숫자로 넘깁니다.
const selectMaxHeight = Number.parseFloat(selectVars.base.enabled.root.maxHeight);

interface SelectClassNames {
  positioner: string;
  content: string;
  scrollArea: string;
  scrollContent: string;
  group: string;
  groupLabel: string;
  separator: string;
}

interface SelectItemClassNames {
  root: string;
  scaleContent: string;
  pressedOverlay: string;
  body: string;
  label: string;
  description: string;
  prefixIcon: string;
  indicator: string;
}
type NativeTransitionHandler = NonNullable<LynxViewProps["bindtransitionend"]>;

type SelectPublicVariantProps = Omit<SelectVariantProps, "size" | "open" | "positioned"> & {
  size?: "large" | "medium" | "responsive";
};
type SelectTriggerPublicVariantProps = Omit<
  SelectTriggerVariantProps,
  "size" | "open" | "pressed" | "disabled" | "readOnly" | "invalid"
>;
type SelectItemPublicVariantProps = Omit<
  SelectItemVariantProps,
  "size" | "selected" | "pressed" | "disabled"
>;

interface SelectStyleContextValue {
  classes: SelectClassNames;
  size: "large" | "medium";
}

const SelectStyleContext = React.createContext<SelectStyleContextValue | null>(null);
const SelectItemClassNamesContext = React.createContext<SelectItemClassNames | null>(null);
const SelectGroupPositionContext = React.createContext({ isFirst: true });

function useSelectStyle(consumer: string): SelectStyleContextValue {
  const context = React.useContext(SelectStyleContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <SelectRoot/>.`);
  return context;
}

function useSelectItemClassNames(consumer: string): SelectItemClassNames {
  const context = React.useContext(SelectItemClassNamesContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <SelectItem/>.`);
  return context;
}

function getScreenWidth(): number | null {
  const systemInfo = typeof SystemInfo === "undefined" ? undefined : SystemInfo;
  const pixelWidth = systemInfo?.pixelWidth;
  const pixelRatio = systemInfo?.pixelRatio;
  if (
    typeof pixelWidth !== "number" ||
    typeof pixelRatio !== "number" ||
    pixelWidth <= 0 ||
    pixelRatio <= 0
  ) {
    return null;
  }
  return pixelWidth / pixelRatio;
}

function hasExitTransition(event: Parameters<NativeTransitionHandler>[0]): boolean {
  if (event.target.uid !== event.currentTarget.uid) return false;
  return (
    event.params.animation_type === "transition-opacity" ||
    event.params.animation_name === "opacity"
  );
}

function renderTextContent(
  className: string,
  value: React.ReactNode,
  ref: React.ForwardedRef<unknown>,
  nativeProps: Omit<LynxHostProps<"view">, "children" | "className">,
) {
  if (typeof value === "string" || typeof value === "number") {
    return (
      <text {...(ref ? { ref: ref as LynxTextRef } : {})} className={className} {...nativeProps}>
        {value}
      </text>
    );
  }

  return (
    <view {...(ref ? { ref: ref as LynxViewRef } : {})} className={className} {...nativeProps}>
      {value}
    </view>
  );
}

/** Trigger 안의 파트가 함께 쓰는 trigger recipe class입니다. 눌림 상태는 Trigger root에만 적용합니다. */
function useTriggerClassNames() {
  const { size } = useSelectStyle("SelectTrigger");
  const { open, disabled, readOnly, invalid } = useSelectContext();
  return selectTrigger({ size, open, disabled, readOnly, invalid });
}

////////////////////////////////////////////////////////////////////////////////////

/**
 * @platform Lynx
 *
 * `@seed-design/lynx-react-select`에 select recipe를 적용합니다. Root는 자식을 native `view`로 감쌉니다.
 * `disabled`·`readOnly`·`invalid`·`required`를 생략하면 감싼 Field의 값을 쓰고, Field 밖이면 `false`입니다.
 *
 * Web-only DOM APIs are intentionally omitted: `asChild`, hidden native select/name/form
 * submission, DOM focus/typeahead/keyboard navigation, and ARIA ids all rely on a browser DOM.
 * Lynx uses native tap, overlay dismissal, `accessibility-*` attributes, and app-owned state.
 */
export interface SelectRootProps
  extends SelectPublicVariantProps,
    SelectTriggerPublicVariantProps,
    SelectItemPublicVariantProps,
    LynxHostProps<"view">,
    UseSelectProps {}

export const SelectRoot = React.forwardRef<unknown, SelectRootProps>((props, ref) => {
  const { size: sizeProp = "large", open, ...restProps } = props;
  const [variantProps, otherProps] = select.splitVariantProps({
    ...restProps,
    size: sizeProp === "responsive" ? undefined : sizeProp,
  });
  const {
    children,
    className,
    value,
    defaultValue,
    onValueChange,
    multiple,
    defaultOpen,
    onOpenChange,
    disabled,
    readOnly,
    invalid,
    required,
    placement,
    gutter,
    overflowPadding,
    formatValue,
    ...nativeProps
  } = otherProps;
  const fieldContext = useFieldContext({ strict: false });
  const api = useSelect({
    value,
    defaultValue,
    onValueChange,
    multiple,
    open,
    defaultOpen,
    onOpenChange,
    disabled: disabled ?? fieldContext?.disabled ?? false,
    readOnly: readOnly ?? fieldContext?.readOnly ?? false,
    invalid: invalid ?? fieldContext?.invalid ?? false,
    required: required ?? fieldContext?.required ?? false,
    placement,
    gutter,
    overflowPadding,
    formatValue,
  });
  const screenWidth = getScreenWidth();
  const size =
    sizeProp === "responsive"
      ? screenWidth != null && screenWidth >= 1280
        ? "medium"
        : "large"
      : (variantProps.size ?? "large");
  const classes = select({ size, open: api.open, positioned: api.positioned });
  const styleValue = React.useMemo<SelectStyleContextValue>(
    () => ({ classes, size }),
    [
      classes.positioner,
      classes.content,
      classes.scrollArea,
      classes.scrollContent,
      classes.group,
      classes.groupLabel,
      classes.separator,
      size,
    ],
  );

  return (
    <SelectProvider value={api}>
      <SelectStyleContext.Provider value={styleValue}>
        <view {...(ref ? { ref: ref as LynxViewRef } : {})} className={className} {...nativeProps}>
          {children}
        </view>
      </SelectStyleContext.Provider>
    </SelectProvider>
  );
});
SelectRoot.displayName = "SelectRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectTriggerProps extends SelectTriggerPublicVariantProps, LynxHostProps<"view"> {
  placeholder?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export const SelectTrigger = React.forwardRef<unknown, SelectTriggerProps>((props, ref) => {
  const {
    children,
    className,
    placeholder,
    prefixIcon,
    suffixIcon,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = props;
  const { size } = useSelectStyle("SelectTrigger");
  const { open, disabled, readOnly, invalid } = useSelectContext();
  const trigger = useSelectTrigger({
    ref,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
  });
  // 눌림 상태는 Scale Feedback의 Main Thread touch handler를 따라갑니다.
  const { bindtouchstart, bindtouchend, bindtouchcancel, ...rootProps } = trigger.rootProps;
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled: trigger.disabled,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });
  const classes = selectTrigger({
    size,
    open,
    pressed: trigger.pressed,
    disabled,
    readOnly,
    invalid,
  });

  return (
    <view
      ref={trigger.rootRef as LynxViewRef}
      className={clsx(classes.root, className)}
      {...mergeProps(scaleFeedbackTriggerProps, rootProps, nativeProps)}
    >
      <view className={classes.pressedOverlay} accessibility-elements-hidden={true} />
      <view className={classes.scaleContent} {...scaleFeedbackTargetProps}>
        {children ?? (
          <>
            <SelectPrefixIcon fallback={prefixIcon} />
            <SelectValue />
            <SelectPlaceholder>{placeholder}</SelectPlaceholder>
            <SelectSuffixIcon icon={suffixIcon} />
          </>
        )}
      </view>
    </view>
  );
});
SelectTrigger.displayName = "SelectTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectValueProps extends LynxHostProps<"view"> {}

export const SelectValue = React.forwardRef<unknown, SelectValueProps>((props, ref) => {
  const { className, ...valueProps } = props;
  const classes = useTriggerClassNames();
  return (
    <SelectValuePrimitive
      {...(ref ? { ref } : {})}
      {...valueProps}
      className={clsx(classes.value, className)}
    />
  );
});
SelectValue.displayName = "SelectValue";

export interface SelectPlaceholderProps extends LynxHostProps<"view"> {}

export const SelectPlaceholder = React.forwardRef<unknown, SelectPlaceholderProps>((props, ref) => {
  const { className, ...placeholderProps } = props;
  const classes = useTriggerClassNames();
  return (
    <SelectPlaceholderPrimitive
      {...(ref ? { ref } : {})}
      {...placeholderProps}
      className={clsx(classes.placeholder, className)}
    />
  );
});
SelectPlaceholder.displayName = "SelectPlaceholder";

export interface SelectPrefixIconProps extends Omit<InternalIconProps, "icon" | "deps"> {
  /** 단일 선택 항목에 `prefixIcon`이 없을 때 표시합니다. */
  fallback?: React.ReactNode;
}

export const SelectPrefixIcon = React.forwardRef<unknown, SelectPrefixIconProps>((props, ref) => {
  const { fallback, className, ...nativeProps } = props;
  const { selectedItem, value } = useSelectContext();
  const classes = useTriggerClassNames();
  const icon = selectedItem?.icon ?? fallback;
  if (!isValidElement<LynxIconElementProps>(icon)) return null;
  return (
    <InternalIcon
      ref={ref}
      icon={icon}
      className={clsx(classes.prefixIcon, className)}
      accessibility-elements-hidden={true}
      deps={[selectedItem?.icon, value]}
      {...nativeProps}
    />
  );
});
SelectPrefixIcon.displayName = "SelectPrefixIcon";

export interface SelectSuffixIconProps extends Omit<InternalIconProps, "icon" | "deps"> {
  icon?: React.ReactNode;
}

export const SelectSuffixIcon = React.forwardRef<unknown, SelectSuffixIconProps>((props, ref) => {
  const { icon, className, ...nativeProps } = props;
  const { open } = useSelectContext();
  const classes = useTriggerClassNames();
  if (!isValidElement<LynxIconElementProps>(icon)) {
    return (
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        className={clsx(classes.suffixIcon, className)}
        accessibility-elements-hidden={true}
        {...nativeProps}
      >
        ⌄
      </text>
    );
  }
  return (
    <InternalIcon
      ref={ref}
      icon={icon}
      className={clsx(classes.suffixIcon, className)}
      accessibility-elements-hidden={true}
      deps={[open]}
      {...nativeProps}
    />
  );
});
SelectSuffixIcon.displayName = "SelectSuffixIcon";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectPositionerProps
  extends LynxHostProps<"view">,
    Pick<SelectPositionerPrimitiveProps, "container" | "overlayLevel" | "overlayViewProps"> {}

/**
 * 화면 전체를 덮는 목록 레이어입니다. `container`가 없으면 Lynx view 안의 고정 native `view`로,
 * `container`를 지정하면 Lynx view 밖까지 덮는 native overlay로 렌더링합니다. `container`가 없을 때
 * 같은 화면의 형제 요소와의 순서는 recipe의 z-index `99`가 정합니다. 닫힌 동안에도 mount해 둡니다.
 */
export const SelectPositioner = React.forwardRef<unknown, SelectPositionerProps>((props, ref) => {
  const { className, ...positionerProps } = props;
  const { classes } = useSelectStyle("SelectPositioner");

  return (
    <SelectPositionerPrimitive
      {...(ref ? { ref } : {})}
      {...positionerProps}
      className={clsx(classes.positioner, className)}
    />
  );
});
SelectPositioner.displayName = "SelectPositioner";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectContentProps extends LynxHostProps<"view"> {}

/**
 * 위치를 계산해 표시하는 목록 표면입니다. `SelectPositioner` 안에 두고, 항목은 `SelectScrollArea` 안에 둡니다.
 */
export const SelectContent = React.forwardRef<unknown, SelectContentProps>((props, ref) => {
  const { className, ...contentProps } = props;
  const { classes } = useSelectStyle("SelectContent");
  const { open, finishClose } = useSelectContext();
  const handleTransitionEnd = React.useCallback<NativeTransitionHandler>(
    (event) => {
      "background only";
      if (!open && hasExitTransition(event)) finishClose();
    },
    [finishClose, open],
  );

  return (
    <SelectContentPrimitive
      {...mergeProps({ bindtransitionend: handleTransitionEnd }, contentProps, ref ? { ref } : {})}
      maxHeight={selectMaxHeight}
      className={clsx(classes.content, className)}
    />
  );
});
SelectContent.displayName = "SelectContent";

////////////////////////////////////////////////////////////////////////////////////

/** `SelectContent` 안에서 목록을 세로로 스크롤하는 viewport입니다. 그룹 사이에 구분선을 넣습니다. */
export interface SelectScrollAreaProps extends LynxHostProps<"scroll-view"> {}

export const SelectScrollArea = React.forwardRef<unknown, SelectScrollAreaProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const { classes } = useSelectStyle("SelectScrollArea");
  const groups = toArray(children);

  return (
    <SelectScrollAreaPrimitive
      {...(ref ? { ref } : {})}
      {...nativeProps}
      className={clsx(classes.scrollArea, className)}
      contentClassName={classes.scrollContent}
    >
      {groups.map((group, index) => (
        <SelectGroupPositionContext.Provider
          key={React.isValidElement(group) ? (group.key ?? index) : index}
          value={{ isFirst: index === 0 }}
        >
          {group}
        </SelectGroupPositionContext.Provider>
      ))}
    </SelectScrollAreaPrimitive>
  );
});
SelectScrollArea.displayName = "SelectScrollArea";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectGroupProps extends LynxHostProps<"view"> {}

export const SelectGroup = React.forwardRef<unknown, SelectGroupProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const { classes } = useSelectStyle("SelectGroup");
  const position = React.useContext(SelectGroupPositionContext);
  return (
    <SelectGroupPrimitive
      {...(ref ? { ref } : {})}
      className={clsx(classes.group, className)}
      {...nativeProps}
    >
      {!position.isFirst ? (
        <view className={classes.separator} accessibility-elements-hidden={true} />
      ) : null}
      {children}
    </SelectGroupPrimitive>
  );
});
SelectGroup.displayName = "SelectGroup";

export interface SelectGroupLabelProps extends LynxHostProps<"text"> {}

export const SelectGroupLabel = React.forwardRef<unknown, SelectGroupLabelProps>((props, ref) => {
  const { className, ...labelProps } = props;
  const { classes } = useSelectStyle("SelectGroupLabel");
  return (
    <SelectGroupLabelPrimitive
      {...(ref ? { ref } : {})}
      className={clsx(classes.groupLabel, className)}
      {...labelProps}
    />
  );
});
SelectGroupLabel.displayName = "SelectGroupLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface SelectItemProps extends SelectItemPublicVariantProps, LynxHostProps<"view"> {
  value: string;
  label?: React.ReactNode;
  textValue?: string;
  /** 항목 앞 아이콘입니다. 단일 선택이면 Trigger의 `SelectPrefixIcon`에도 표시합니다. */
  prefixIcon?: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
}

export const SelectItem = React.forwardRef<unknown, SelectItemProps>((props, ref) => {
  const [variantProps, otherProps] = selectItem.splitVariantProps(props);
  const { disabled } = variantProps;
  const {
    value,
    label,
    textValue,
    prefixIcon,
    readOnly,
    children,
    className,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
    ...nativeProps
  } = otherProps;
  const { size } = useSelectStyle("SelectItem");
  const api = useSelectItem({
    ref,
    value,
    label,
    textValue,
    icon: prefixIcon,
    disabled,
    readOnly,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
  });
  // 눌림 상태는 Scale Feedback의 Main Thread touch handler를 따라갑니다.
  const { bindtouchstart, bindtouchend, bindtouchcancel, ...rootProps } = api.rootProps;
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled: api.disabled,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });
  const classes = selectItem({
    ...variantProps,
    size,
    disabled: api.disabled,
    selected: api.selected,
    pressed: api.pressed,
  });

  return (
    <SelectItemProvider value={api}>
      <SelectItemClassNamesContext.Provider value={classes}>
        <view
          ref={api.rootRef as LynxViewRef}
          className={clsx(classes.root, className)}
          {...mergeProps(scaleFeedbackTriggerProps, rootProps, nativeProps)}
        >
          <view className={classes.pressedOverlay} accessibility-elements-hidden={true} />
          <view className={classes.scaleContent} {...scaleFeedbackTargetProps}>
            {children}
          </view>
        </view>
      </SelectItemClassNamesContext.Provider>
    </SelectItemProvider>
  );
});
SelectItem.displayName = "SelectItem";

export interface SelectItemPrefixIconProps extends Omit<InternalIconProps, "icon" | "deps"> {
  icon?: React.ReactNode;
}

export const SelectItemPrefixIcon = React.forwardRef<unknown, SelectItemPrefixIconProps>(
  (props, ref) => {
    const { icon: iconOverride, className, ...nativeProps } = props;
    const item = useSelectItemContext();
    const classes = useSelectItemClassNames("SelectItemPrefixIcon");
    const icon = iconOverride ?? item.icon;
    if (!isValidElement<LynxIconElementProps>(icon)) return null;
    return (
      <InternalIcon
        ref={ref}
        icon={icon}
        className={clsx(classes.prefixIcon, className)}
        accessibility-elements-hidden={true}
        deps={[item.selected, item.disabled, item.pressed, icon]}
        {...nativeProps}
      />
    );
  },
);
SelectItemPrefixIcon.displayName = "SelectItemPrefixIcon";

export interface SelectItemBodyProps extends LynxHostProps<"view"> {}

export const SelectItemBody = React.forwardRef<unknown, SelectItemBodyProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classes = useSelectItemClassNames("SelectItemBody");
  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classes.body, className)}
      {...nativeProps}
    >
      {children}
    </view>
  );
});
SelectItemBody.displayName = "SelectItemBody";

export interface SelectItemLabelProps extends LynxHostProps<"view"> {}

export const SelectItemLabel = React.forwardRef<unknown, SelectItemLabelProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const { label } = useSelectItemContext();
  const classes = useSelectItemClassNames("SelectItemLabel");
  return renderTextContent(clsx(classes.label, className), children ?? label, ref, nativeProps);
});
SelectItemLabel.displayName = "SelectItemLabel";

export interface SelectItemDescriptionProps extends LynxHostProps<"view"> {}

export const SelectItemDescription = React.forwardRef<unknown, SelectItemDescriptionProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const classes = useSelectItemClassNames("SelectItemDescription");
    return renderTextContent(clsx(classes.description, className), children, ref, nativeProps);
  },
);
SelectItemDescription.displayName = "SelectItemDescription";

export interface SelectItemIndicatorProps extends Omit<InternalIconProps, "icon" | "deps"> {
  selected?: React.ReactNode;
  unselected?: React.ReactNode;
}

export const SelectItemIndicator = React.forwardRef<unknown, SelectItemIndicatorProps>(
  (props, ref) => {
    const { selected: selectedIcon, unselected, className, ...nativeProps } = props;
    const item = useSelectItemContext();
    const classes = useSelectItemClassNames("SelectItemIndicator");
    const icon = item.selected ? selectedIcon : unselected;
    if (!isValidElement<LynxIconElementProps>(icon)) {
      if (!item.selected) return null;
      return (
        <text
          {...(ref ? { ref: ref as LynxTextRef } : {})}
          className={clsx(classes.indicator, className)}
          accessibility-elements-hidden={true}
          {...nativeProps}
        >
          ✓
        </text>
      );
    }
    return (
      <InternalIcon
        ref={ref}
        icon={icon}
        className={clsx(classes.indicator, className)}
        accessibility-elements-hidden={true}
        deps={[item.selected, item.disabled, item.pressed, icon]}
        {...nativeProps}
      />
    );
  },
);
SelectItemIndicator.displayName = "SelectItemIndicator";
