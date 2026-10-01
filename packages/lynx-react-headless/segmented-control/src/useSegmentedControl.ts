import { useCallback, useMemo, useState } from "@lynx-js/react";
import type { CSSProperties, IntrinsicElements } from "@lynx-js/types";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";

type ViewProps = IntrinsicElements["view"];
type RootAccessibilityProps = Pick<
  ViewProps,
  "accessibility-element" | "accessibility-role-description"
>;

export interface UseSegmentedControlStateProps {
  /** controlled 선택 값입니다. 지정하면 Item 선택은 `onValueChange`만 호출합니다. */
  value?: string;

  /** uncontrolled 초기 선택 값입니다. */
  defaultValue?: string;

  onValueChange?: (value: string) => void;
}

export interface UseSegmentedControlProps
  extends UseSegmentedControlStateProps,
    RootAccessibilityProps {
  /**
   * `true`이면 모든 Item의 press·사용자 tap handler·선택 변경이 막힙니다.
   * @default false
   */
  disabled?: boolean;
}

export interface UseSegmentedControlReturn {
  value: string | undefined;
  /** 선택 값을 바꿉니다. controlled이면 `onValueChange`만 호출합니다. disabled를 검사하지 않습니다. */
  setValue: (value: string) => void;
  disabled: boolean;
  /** 등록된 Item 값입니다. 처음 마운트된 Item은 렌더 순서대로, 나중에 추가된 Item은 끝에 붙습니다. */
  items: readonly string[];
  /** 등록된 Item 수입니다. */
  segmentCount: number;
  /** `items`에서 선택 값의 위치입니다. 선택 값이 등록되지 않았으면 `-1`입니다. */
  segmentIndex: number;
  /** Item 값을 등록하고 해제 함수를 반환합니다. 이미 등록된 값은 무시합니다. */
  registerItem: (value: string) => () => void;
  /**
   * Root native view에 펼칩니다. `style`의 `--segment-count`는 1 이상,
   * `--segment-index`는 0 이상으로 보정한 값입니다. 선택 여부는 `segmentIndex >= 0`으로 판단합니다.
   */
  rootProps: Required<RootAccessibilityProps> & { style: CSSProperties };
}

/**
 * @platform Lynx
 *
 * SegmentedControl의 단일 선택 값, Item 등록 순서, disabled, CSS geometry 입력을 제공하는 headless 훅입니다.
 * Item의 폭·위치를 측정하지 않고 `--segment-count`·`--segment-index`만 제공합니다.
 * 웹 `@seed-design/react-segmented-control`과 달리 form 제출 모델이 없어 hidden input을 만들지 않습니다.
 */
export function useSegmentedControl(
  props: UseSegmentedControlProps = {},
): UseSegmentedControlReturn {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    disabled = false,
    "accessibility-element": accessibilityElement = true,
    "accessibility-role-description": accessibilityRoleDescription = "radiogroup",
  } = props;
  const [value, setValue] = useControllableState<string | undefined>({
    value: valueProp,
    defaultValue,
    onChange(nextValue) {
      "background only";
      if (nextValue !== undefined) onValueChange?.(nextValue);
    },
  });
  const [items, setItems] = useState<readonly string[]>([]);

  const registerItem = useCallback((itemValue: string) => {
    "background only";
    setItems((current) => (current.includes(itemValue) ? current : [...current, itemValue]));
    return () => {
      "background only";
      setItems((current) => current.filter((item) => item !== itemValue));
    };
  }, []);

  const segmentCount = items.length;
  const segmentIndex = value === undefined ? -1 : items.indexOf(value);

  return useMemo<UseSegmentedControlReturn>(
    () => ({
      value,
      setValue,
      disabled,
      items,
      segmentCount,
      segmentIndex,
      registerItem,
      rootProps: {
        "accessibility-element": accessibilityElement,
        "accessibility-role-description": accessibilityRoleDescription,
        style: {
          "--segment-count": Math.max(segmentCount, 1).toString(),
          "--segment-index": Math.max(segmentIndex, 0).toString(),
        } as CSSProperties,
      },
    }),
    [
      value,
      setValue,
      disabled,
      items,
      segmentCount,
      segmentIndex,
      registerItem,
      accessibilityElement,
      accessibilityRoleDescription,
    ],
  );
}
