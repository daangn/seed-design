import { useCallback, useMemo, useRef, useState, type RefObject } from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import { useFieldContext } from "@seed-design/lynx-react-field";

export interface UseTextFieldProps {
  value?: string;

  /**
   * @default ""
   */
  defaultValue?: string;

  /**
   * native 입력으로 값이 바뀌면 호출됩니다. 현재 값과 같으면 호출하지 않습니다.
   * controlled에서는 부모가 다른 값으로 바꿔 commit하면 native 입력도 그 값으로 되돌립니다.
   */
  onValueChange?: (value: string) => void;

  /**
   * `FieldRoot` 안에서 생략하면 Field 값을 따릅니다.
   * @default false
   */
  required?: boolean;

  /**
   * `FieldRoot` 안에서 생략하면 Field 값을 따릅니다. 값 변경과 키보드 회피 등록을 막습니다.
   * @default false
   */
  disabled?: boolean;

  /**
   * `FieldRoot` 안에서 생략하면 Field 값을 따릅니다.
   * 입력 파트가 native 입력 대신 `<text>`를 렌더링해 focus·selection·편집 메뉴를 없앱니다.
   * @default false
   */
  readOnly?: boolean;

  /**
   * `FieldRoot` 안에서 생략하면 Field 값을 따릅니다.
   * @default false
   */
  invalid?: boolean;

  /** 입력 파트의 native `name`으로 전달됩니다. */
  name?: string;

  /**
   * native 입력이 받을 UTF-16 길이 상한입니다. `useTextFieldWithGraphemes`가 grapheme 최대 개수에
   * 도달한 값에서 계산해 넘기며, 범위 선택 교체·composition 중에는 적용하지 않습니다.
   * 입력 파트의 `maxlength`를 함께 지정하면 더 작은 값을 씁니다.
   */
  nativeInsertionMaxLength?: number;
}

export interface UseTextFieldReturn {
  /** `TextFieldRoot`가 렌더링한 native `<view>`의 ref입니다. 키보드 회피의 입력 영역으로 측정됩니다. */
  rootRef: RefObject<NodesRef | null>;
  value: string;
  /** `value`를 받았는지 여부입니다. 입력 파트가 부모의 commit 값으로 native 값을 되돌릴지 판단합니다. */
  controlled: boolean;
  nativeInsertionMaxLength?: number;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  name?: string;
  /** 입력 파트가 알린 focus 상태입니다. `FieldRoot` 안에서는 Field의 `focused`를 따릅니다. */
  focused: boolean;
  /** uncontrolled 값을 갱신하고 값이 바뀌었으면 `onValueChange`를 호출합니다. 같은 함수가 유지됩니다. */
  setValue: (value: string) => void;
  /** focus 상태를 갱신하고 `FieldRoot`에도 알립니다. 같은 함수가 유지됩니다. */
  setFocused: (focused: boolean) => void;
}

/**
 * @platform Lynx
 *
 * TextField의 값·상태와 Root native ref를 만듭니다. native 입력 연결은 `useTextFieldInput`이 맡습니다.
 *
 * React `@seed-design/react-text-field`와의 차이:
 * - `FieldRoot` 안에서는 생략한 `required`·`disabled`·`readOnly`·`invalid`를 Field에서 읽고
 *   focus 상태를 Field에 알립니다. Lynx Field는 prop getter 대신 이 상태를 입력이 직접 쓰는 계약입니다.
 * - `stateProps`·`rootProps` 같은 DOM data/aria 속성과 hover·active·focus-visible 상태가 없습니다.
 * - Lynx native 입력은 value attribute가 없으므로 controlled 값은 입력 파트가 `setValue` UI method로 맞춥니다.
 */
export function useTextField(props: UseTextFieldProps = {}): UseTextFieldReturn {
  const {
    value: controlledValue,
    defaultValue = "",
    onValueChange,
    nativeInsertionMaxLength,
    name,
  } = props;
  const fieldContext = useFieldContext({ strict: false });
  const rootRef = useRef<NodesRef | null>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [localFocused, setLocalFocused] = useState(false);
  const controlled = controlledValue !== undefined;
  const value = controlled ? controlledValue : uncontrolledValue;
  const required = props.required ?? fieldContext?.required ?? false;
  const disabled = props.disabled ?? fieldContext?.disabled ?? false;
  const readOnly = props.readOnly ?? fieldContext?.readOnly ?? false;
  const invalid = props.invalid ?? fieldContext?.invalid ?? false;
  const focused = fieldContext?.focused ?? localFocused;
  const valueRef = useRef(value);
  const controlledRef = useRef(controlled);
  const onValueChangeRef = useRef(onValueChange);
  const fieldContextRef = useRef(fieldContext);
  valueRef.current = value;
  controlledRef.current = controlled;
  onValueChangeRef.current = onValueChange;
  fieldContextRef.current = fieldContext;

  const setFocused = useCallback((nextFocused: boolean) => {
    "background only";

    setLocalFocused(nextFocused);
    fieldContextRef.current?.setFocused(nextFocused);
  }, []);

  const setValue = useCallback((nextValue: string) => {
    "background only";

    if (!controlledRef.current) {
      setUncontrolledValue(nextValue);
    }
    if (nextValue !== valueRef.current) {
      onValueChangeRef.current?.(nextValue);
    }
  }, []);

  return useMemo(
    () => ({
      rootRef,
      value,
      controlled,
      nativeInsertionMaxLength,
      required,
      disabled,
      readOnly,
      invalid,
      name,
      focused,
      setValue,
      setFocused,
    }),
    [
      value,
      controlled,
      nativeInsertionMaxLength,
      required,
      disabled,
      readOnly,
      invalid,
      name,
      focused,
      setValue,
      setFocused,
    ],
  );
}
