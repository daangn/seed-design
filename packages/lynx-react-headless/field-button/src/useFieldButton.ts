import { useCallback, useMemo } from "@lynx-js/react";

const EMPTY_VALUES: string[] = [];

export interface UseFieldButtonProps {
  /**
   * 소비자가 소유한 선택값입니다. Root는 이 값을 내부 state로 복사하지 않습니다.
   * @default []
   */
  values?: string[];

  /**
   * `FieldButtonClearButton` tap 등에서 값 변경을 요청할 때 호출됩니다.
   * Root는 값을 직접 바꾸지 않으므로 소비자가 `values`를 갱신해야 표시가 바뀝니다.
   */
  onValuesChange?: (values: string[]) => void;

  /**
   * `true`이면 Button·ClearButton tap이 막히고 ClearButton을 렌더링하지 않습니다.
   * @default false
   */
  disabled?: boolean;

  /**
   * @default false
   */
  invalid?: boolean;

  /**
   * `disabled`와 같이 Button·ClearButton tap을 막고 ClearButton을 렌더링하지 않습니다.
   * @default false
   */
  readOnly?: boolean;
}

export interface UseFieldButtonReturn {
  values: string[];
  disabled: boolean;
  invalid: boolean;
  readOnly: boolean;
  /** `disabled`와 `readOnly`가 모두 `false`일 때만 `true`입니다. */
  interactive: boolean;
  /** `onValuesChange`만 호출합니다. 내부 state는 없습니다. */
  setValues: (values: string[]) => void;
}

/**
 * @platform Lynx
 *
 * FieldButton의 상태를 만듭니다. 선택값은 controlled로만 받고 소유하지 않습니다.
 * Button의 눌림 상태와 tap은 `useFieldButtonButton`, 값 지우기는 `useFieldButtonClearButton`이 연결합니다.
 *
 * React `@seed-design/react-field-button`과의 차이:
 * - `name`과 `HiddenInput`이 없습니다. Lynx에는 native form 제출 모델이 없습니다.
 * - DOM id·`aria-describedby` 연결, hover·focus·focus-visible 상태가 없습니다.
 * - React의 `active`는 Lynx 관례대로 `useFieldButtonButton`의 `pressed`입니다.
 */
export function useFieldButton(props: UseFieldButtonProps = {}): UseFieldButtonReturn {
  const {
    values = EMPTY_VALUES,
    onValuesChange,
    disabled = false,
    invalid = false,
    readOnly = false,
  } = props;
  const interactive = !disabled && !readOnly;

  const setValues = useCallback(
    (nextValues: string[]) => {
      "background only";
      onValuesChange?.(nextValues);
    },
    [onValuesChange],
  );

  return useMemo(
    () => ({ values, disabled, invalid, readOnly, interactive, setValues }),
    [values, disabled, invalid, readOnly, interactive, setValues],
  );
}
