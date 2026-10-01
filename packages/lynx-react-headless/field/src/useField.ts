import { useMemo, useRef, useState, type RefObject } from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";

export interface UseFieldProps {
  /**
   * @default false
   */
  required?: boolean;

  /**
   * @default false
   */
  disabled?: boolean;

  /**
   * @default false
   */
  readOnly?: boolean;

  /**
   * @default false
   */
  invalid?: boolean;
}

export interface UseFieldReturn {
  /**
   * `FieldRoot`가 렌더링한 native `<view>`의 ref입니다.
   * 입력 consumer가 keyboard 회피처럼 Field 영역 전체를 측정해야 할 때 사용합니다.
   */
  rootRef: RefObject<NodesRef | null>;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;

  /** 하위 입력이 `setFocused`로 알린 focus 상태입니다. Field가 스스로 focus를 관찰하지 않습니다. */
  focused: boolean;

  /**
   * 입력 consumer가 native focus·blur 때 호출합니다. 같은 함수가 유지됩니다.
   * focus된 입력이 blur 없이 unmount되면 consumer가 `false`로 되돌려야 합니다.
   */
  setFocused: (focused: boolean) => void;
}

/**
 * @platform Lynx
 *
 * Field의 상태와 native root ref를 만듭니다. 입력 value는 소유하지 않습니다.
 *
 * React `@seed-design/react-field`와의 차이:
 * - `name`, DOM id·`aria-*` 연결, `inputProps`·`labelProps` 등 prop getter가 없습니다.
 *   Lynx에는 native form 제출 모델과 id 기반 접근성 연결이 없습니다.
 * - hover·active·focus-visible 같은 pointer 상태가 없습니다.
 * - `rootRef`는 Lynx 전용입니다. React의 `refs`는 Label 등의 렌더 여부를 감지하는 다른 계약입니다.
 */
export function useField(props: UseFieldProps = {}): UseFieldReturn {
  const { required = false, disabled = false, readOnly = false, invalid = false } = props;
  const rootRef = useRef<NodesRef | null>(null);
  const [focused, setFocused] = useState(false);

  return useMemo(
    () => ({ rootRef, required, disabled, readOnly, invalid, focused, setFocused }),
    [required, disabled, readOnly, invalid, focused],
  );
}
