import { segmentedControl } from "@seed-design/lynx-css/recipes/segmented-control";
import * as React from "@lynx-js/react";
import clsx from "clsx";

import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxViewProps,
  LynxViewRef,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";

interface SegmentedControlContextValue {
  value: string | undefined;
  disabled: boolean;
  items: string[];
  selectValue: (value: string) => void;
  registerItem: (value: string) => () => void;
}

const SegmentedControlContext = React.createContext<SegmentedControlContextValue | null>(null);
const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(segmentedControl);

function useSegmentedControlContext(consumer: string) {
  const context = React.useContext(SegmentedControlContext);
  if (!context) {
    throw new Error(`<${consumer}/> must be rendered inside <SegmentedControlRoot/>.`);
  }
  return context;
}

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - HiddenInput, name, form: Lynx에 HTML form 제출 모델이 없음
 * - focus, focusVisible: Lynx에 키보드 포커스 모델이 없음
 * - raw DOM change event: 선택 변경은 onValueChange로 노출
 */
export interface SegmentedControlRootProps extends LynxStyledElementProps, LynxAccessibilityProps {
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
}

export const SegmentedControlRoot = React.forwardRef<unknown, SegmentedControlRootProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      value: valueProp,
      defaultValue,
      disabled = false,
      onValueChange,
      "accessibility-element": accessibilityElement = true,
      "accessibility-role-description": accessibilityRoleDescription = "radiogroup",
      ...nativeProps
    } = props;
    const [value, setValue] = useControllableState<string | undefined>({
      value: valueProp,
      defaultValue,
      onChange(nextValue) {
        "background only";
        if (nextValue !== undefined) onValueChange?.(nextValue);
      },
    });
    const [items, setItems] = React.useState<string[]>([]);

    const registerItem = React.useCallback((itemValue: string) => {
      setItems((current) => {
        if (current.includes(itemValue)) return current;
        return [...current, itemValue];
      });
      return () => {
        "background only";
        setItems((current) => current.filter((item) => item !== itemValue));
      };
    }, []);

    const selectValue = React.useCallback(
      (nextValue: string) => {
        if (!disabled) setValue(nextValue);
      },
      [disabled, setValue],
    );
    const selectedIndex = items.indexOf(value ?? "");
    const classNames = segmentedControl({ hasSelection: selectedIndex >= 0 });
    const contextValue = React.useMemo<SegmentedControlContextValue>(
      () => ({
        value,
        disabled,
        items,
        selectValue,
        registerItem,
      }),
      [value, disabled, items, selectValue, registerItem],
    );

    return (
      <SegmentedControlContext.Provider value={contextValue}>
        <ClassNamesProvider value={classNames}>
          <view
            {...(ref ? { ref: ref as LynxViewRef } : {})}
            {...nativeProps}
            accessibility-element={accessibilityElement}
            accessibility-role-description={accessibilityRoleDescription}
            className={clsx(classNames.root, className)}
            style={
              {
                "--segment-count": Math.max(items.length, 1).toString(),
                "--segment-index": Math.max(selectedIndex, 0).toString(),
                ...style,
              } as LynxViewProps["style"]
            }
          >
            {children}
          </view>
        </ClassNamesProvider>
      </SegmentedControlContext.Provider>
    );
  },
);
SegmentedControlRoot.displayName = "SegmentedControlRoot";

export interface SegmentedControlItemProps
  extends Omit<LynxStyledElementProps, "children">,
    LynxAccessibilityProps,
    LynxPressableProps {
  children: string | number;
  value: string;
  disabled?: boolean;
}

export const SegmentedControlItem = React.forwardRef<unknown, SegmentedControlItemProps>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      value: itemValue,
      disabled: itemDisabled = false,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElement = true,
      "accessibility-label": accessibilityLabel,
      "accessibility-role-description": accessibilityRoleDescription = "radio",
      "accessibility-traits": accessibilityTraits,
      ...nativeProps
    } = props;
    const context = useSegmentedControlContext("SegmentedControlItem");
    const disabled = context.disabled || itemDisabled;
    const selected = context.value === itemValue;

    React.useEffect(() => {
      "background only";
      return context.registerItem(itemValue);
    }, [context.registerItem, itemValue]);

    const handleTap = React.useCallback(
      (...args: Parameters<NonNullable<LynxPressableProps["bindtap"]>>) => {
        "background only";
        if (!selected) context.selectValue(itemValue);
        bindtap?.(...args);
      },
      [bindtap, context.selectValue, itemValue, selected],
    );
    const pressSelectionRef = React.useRef(selected);
    const { pressed, bindtouchstart, ...pressHandlers } = usePressTap({
      disabled,
      onTap: handleTap,
      mainThreadOnTap: mainThreadBindtap,
    });
    const handleTouchStart = React.useCallback(
      (...args: Parameters<typeof bindtouchstart>) => {
        pressSelectionRef.current = selected;
        bindtouchstart(...args);
      },
      [bindtouchstart, selected],
    );
    const classes = segmentedControl({ selected, disabled, pressed });
    const pressStartClasses = segmentedControl({
      selected: pressSelectionRef.current,
      disabled,
      pressed,
    });
    const label =
      typeof children === "string" || typeof children === "number" ? String(children) : undefined;

    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        {...nativeProps}
        bindtouchstart={handleTouchStart}
        {...pressHandlers}
        accessibility-element={accessibilityElement}
        accessibility-label={accessibilityLabel ?? label}
        accessibility-role-description={accessibilityRoleDescription}
        accessibility-value={selected ? "selected" : "not selected"}
        accessibility-traits={
          disabled ? "disabled" : selected ? "selected" : (accessibilityTraits ?? "button")
        }
        className={clsx(classes.item, className)}
        style={style}
      >
        <view accessibility-elements-hidden={true} className={pressStartClasses.itemBackground} />
        <text className={classes.label}>{children}</text>
      </view>
    );
  },
);
SegmentedControlItem.displayName = "SegmentedControlItem";

export interface SegmentedControlIndicatorProps extends LynxStyledElementProps {}

export const SegmentedControlIndicator = React.forwardRef<unknown, SegmentedControlIndicatorProps>(
  (props, ref) => {
    const { className, style, ...nativeProps } = props;
    const classNames = useClassNames();

    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        {...nativeProps}
        accessibility-elements-hidden={true}
        className={clsx(classNames.indicator, className)}
        style={style}
      />
    );
  },
);
SegmentedControlIndicator.displayName = "SegmentedControlIndicator";
