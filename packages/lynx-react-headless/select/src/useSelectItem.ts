import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ForwardedRef,
  type ReactNode,
} from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";
import { usePressTap, type UsePressTapReturn } from "@seed-design/lynx-react-use-press-tap";

import { useSelectContext } from "./useSelectContext.js";

type ViewProps = IntrinsicElements["view"];
type TapHandler = NonNullable<ViewProps["bindtap"]>;

export interface UseSelectItemProps
  extends Pick<
    ViewProps,
    | "bindtap"
    | "main-thread:bindtap"
    | "main-thread:bindtouchstart"
    | "main-thread:bindtouchend"
    | "main-thread:bindtouchcancel"
    | "accessibility-element"
    | "accessibility-label"
    | "accessibility-traits"
    | "accessibility-value"
  > {
  value: string;

  /** 항목 행에 표시할 label입니다. Trigger에는 `textValue`를 표시합니다. */
  label?: ReactNode;

  /** Trigger 표시와 접근성 label에 쓰는 문자열입니다. 생략하면 문자열 `label`, 그것도 없으면 `value`입니다. */
  textValue?: string;

  /** 항목의 아이콘입니다. 이 훅은 렌더링하지 않고 등록만 합니다. 단일 선택이면 `selectedItem.icon`이 됩니다. */
  icon?: ReactNode;

  /** `true`이거나 Root가 `disabled`·`readOnly`이면 탭해도 값과 callback이 바뀌지 않습니다. @default false */
  disabled?: boolean;

  /** `disabled`와 같이 선택을 막습니다. @default false */
  readOnly?: boolean;

  /** 항목 native node를 함께 받을 ref입니다. */
  ref?: ForwardedRef<unknown>;
}

export type SelectItemRootProps = Omit<UsePressTapReturn, "pressed"> &
  Pick<
    ViewProps,
    | "accessibility-element"
    | "accessibility-label"
    | "accessibility-role-description"
    | "accessibility-value"
    | "accessibility-traits"
  >;

export interface UseSelectItemReturn {
  value: string;
  label: ReactNode;
  textValue: string;
  icon: ReactNode;
  selected: boolean;
  disabled: boolean;
  pressed: boolean;
  /** 항목 native `<view>`의 `ref`에 넘깁니다. 선택 항목 스크롤에 쓸 node를 등록하고 `ref` prop에도 전달합니다. */
  rootRef: (node: NodesRef | null) => void;
  /** 항목 native `<view>`에 펼칠 tap·눌림·접근성 props입니다. */
  rootProps: SelectItemRootProps;
}

/**
 * @platform Lynx
 *
 * 항목을 Root에 등록하고 tap·눌림 상태·접근성을 연결합니다. 활성 항목을 탭하면 값을 바꾼 뒤 사용자
 * `bindtap`을 실행합니다. 단일 선택이면 `"itemSelect"` reason으로 닫고, 다중 선택이면 열어 둡니다.
 * `accessibility-label`은 `textValue`, `accessibility-value`는 `"selected"`·`"not selected"`가 기본값입니다.
 */
export function useSelectItem(props: UseSelectItemProps): UseSelectItemReturn {
  const {
    value,
    label,
    textValue: textValueProp,
    icon,
    disabled: disabledProp = false,
    readOnly = false,
    ref,
    bindtap,
    "main-thread:bindtap": mainThreadOnTap,
    "main-thread:bindtouchstart": mainThreadOnTouchStart,
    "main-thread:bindtouchend": mainThreadOnTouchEnd,
    "main-thread:bindtouchcancel": mainThreadOnTouchCancel,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
  } = props;
  const context = useSelectContext();
  const { registerItem, unregisterItem, selectValue } = context;
  // ReactLynx는 같은 요소에도 ref를 새 node 객체로 다시 적용합니다. 의미 있는 변경이 아니므로 처음 붙을 때만
  // state를 바꿔 등록하고, 이후 node는 ref에만 둡니다.
  const nodeRef = useRef<NodesRef | null>(null);
  const nodeAttachedRef = useRef(false);
  const [nodeAttached, setNodeAttached] = useState(false);
  const disabled = context.disabled || context.readOnly || disabledProp || readOnly;
  const selected = context.value.includes(value);
  const textValue = textValueProp ?? (typeof label === "string" ? label : value);
  const handleTap = useCallback<TapHandler>(
    (event, instance) => {
      "background only";
      selectValue(value, event);
      bindtap?.(event, instance);
    },
    [bindtap, selectValue, value],
  );
  const { pressed, ...pressHandlers } = usePressTap({
    disabled,
    onTap: handleTap,
    mainThreadOnTap,
    mainThreadOnTouchStart,
    mainThreadOnTouchEnd,
    mainThreadOnTouchCancel,
  });
  const {
    bindtap: pressBindtap,
    bindtouchstart,
    bindtouchend,
    bindtouchcancel,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
  } = pressHandlers;
  const rootRef = useCallback(
    (node: NodesRef | null) => {
      nodeRef.current = node;
      if (node && !nodeAttachedRef.current) {
        nodeAttachedRef.current = true;
        setNodeAttached(true);
      }
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  useEffect(() => {
    "background only";
    registerItem(value, { label, textValue, icon, node: nodeRef.current });
    return () => unregisterItem(value);
  }, [registerItem, unregisterItem, label, nodeAttached, icon, textValue, value]);
  const resolvedLabel = accessibilityLabel ?? textValue;
  const resolvedValue = accessibilityValue ?? (selected ? "selected" : "not selected");
  const traits = disabled ? "disabled" : accessibilityTraits;
  const rootProps = useMemo<SelectItemRootProps>(
    () => ({
      "accessibility-element": accessibilityElement,
      "accessibility-label": resolvedLabel,
      "accessibility-role-description": "option",
      "accessibility-value": resolvedValue,
      "accessibility-traits": traits,
      bindtap: pressBindtap,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      ...(mainThreadBindtap ? { "main-thread:bindtap": mainThreadBindtap } : {}),
      ...(mainThreadBindtouchstart
        ? { "main-thread:bindtouchstart": mainThreadBindtouchstart }
        : {}),
      ...(mainThreadBindtouchend ? { "main-thread:bindtouchend": mainThreadBindtouchend } : {}),
      ...(mainThreadBindtouchcancel
        ? { "main-thread:bindtouchcancel": mainThreadBindtouchcancel }
        : {}),
    }),
    [
      accessibilityElement,
      resolvedLabel,
      resolvedValue,
      traits,
      pressBindtap,
      bindtouchstart,
      bindtouchend,
      bindtouchcancel,
      mainThreadBindtap,
      mainThreadBindtouchstart,
      mainThreadBindtouchend,
      mainThreadBindtouchcancel,
    ],
  );

  return useMemo(
    () => ({ value, label, textValue, icon, selected, disabled, pressed, rootRef, rootProps }),
    [value, label, textValue, icon, selected, disabled, pressed, rootRef, rootProps],
  );
}
