import type * as React from "react";

/** 시간과 시간대를 포함하지 않는 Gregorian 달력 날짜입니다. */
export interface DatePickerDate {
  /** Gregorian 달력의 연도입니다. */
  year: number;
  /** 1부터 12까지의 월입니다. */
  month: number;
  /** 해당 월에 존재하는 날짜입니다. */
  day: number;
}

export interface DatePickerRangeValue {
  /** 선택한 범위의 시작일입니다. */
  start: DatePickerDate;
  /** 선택한 범위의 종료일입니다. 시작일만 선택한 동안에는 `undefined`입니다. */
  end?: DatePickerDate;
}

export type DatePickerSelectionMode = "single" | "range" | "multiple";
export type DatePickerVisibleRange = "month" | "twoMonths" | "continuous" | "week";

export type DatePickerValue =
  | DatePickerDate
  | DatePickerRangeValue
  | readonly DatePickerDate[]
  | undefined;

export interface DatePickerConstraintContext {
  /** 현재 선택 모드입니다. */
  selectionMode: DatePickerSelectionMode;
  /** 현재 선택 값입니다. */
  value: DatePickerValue;
  /** Range에서 종료일을 고르는 중인 경우의 시작일입니다. */
  rangeStart: DatePickerDate | undefined;
  /** 후보 날짜를 선택하려는지, 기존 선택에서 해제하려는지 나타냅니다. */
  action: "select" | "deselect";
}

/**
 * 후보 날짜를 선택할 수 있으면 `true`를 반환합니다.
 *
 * 인자를 하나만 받는 `(date) => boolean` 함수도 사용할 수 있습니다.
 */
export type DatePickerConstraint = (
  candidate: DatePickerDate,
  context: DatePickerConstraintContext,
) => boolean;

export interface DatePickerAriaLabels {
  /** Date Picker 루트의 접근성 이름입니다. */
  root: string;
  /** 이전 달 버튼의 접근성 이름입니다. */
  previousMonth: string;
  /** 다음 달 버튼의 접근성 이름입니다. */
  nextMonth: string;
  /** 이전 주 버튼의 접근성 이름입니다. */
  previousWeek: string;
  /** 다음 주 버튼의 접근성 이름입니다. */
  nextWeek: string;
  /** 연도 Wheel의 접근성 이름입니다. */
  yearWheel: string;
  /** 월 Wheel의 접근성 이름입니다. */
  monthWheel: string;
  /** 변경할 수 없는 Range 시작일을 설명하는 접근성 이름입니다. */
  readOnlyRangeStart: string;
}

export interface DatePickerActions {
  /**
   * 해당 날짜가 보이도록 이동하고 roving tab stop을 갱신합니다.
   * 현재 DOM 포커스는 이동하지 않습니다.
   */
  navigateToDate: (date: DatePickerDate) => void;
  /**
   * 해당 날짜가 보이도록 이동한 뒤 날짜 셀에 DOM 포커스를 둡니다.
   */
  focusDate: (date: DatePickerDate) => void;
}

interface DatePickerCommonProps {
  /**
   * 날짜 선택 방식입니다.
   *
   * - `single`: 하나의 날짜를 선택합니다.
   * - `range`: 시작일과 종료일로 이루어진 날짜 범위를 선택합니다.
   * - `multiple`: 여러 날짜를 선택합니다.
   *
   * @default "single"
   */
  selectionMode?: DatePickerSelectionMode;
  /**
   * 한 번에 표시할 달력 범위입니다.
   *
   * @default "month"
   */
  visibleRange?: DatePickerVisibleRange;
  /** 제어할 표시 기준 날짜입니다. Month 계열에서는 월의 첫날, Week에서는 주 시작일로 정규화합니다. */
  viewDate?: DatePickerDate;
  /** 제어하지 않는 방식으로 사용할 때의 초기 표시 기준 날짜입니다. */
  defaultViewDate?: DatePickerDate;
  /** 표시 기준 날짜가 바뀔 때 호출됩니다. */
  onViewDateChange?: (value: DatePickerDate) => void;
  /** 오늘로 표시할 날짜입니다. SSR이나 테스트에서 현재 날짜를 고정할 때 사용할 수 있습니다. */
  today?: DatePickerDate;
  /**
   * 월·요일·날짜·숫자 표기와 기본 주 시작일을 결정합니다.
   *
   * @default "ko-KR"
   */
  locale?: string | string[];
  /** 주 시작 요일을 재정의합니다. 0은 일요일, 6은 토요일입니다. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * 이동하고 선택할 수 있는 연도 범위입니다. 양끝 연도를 포함합니다.
   *
   * @default today.year ± 100
   */
  yearRange?: {
    start: number;
    end: number;
  };
  /** 날짜 선택 조건입니다. 모든 함수가 `true`를 반환해야 선택할 수 있습니다. */
  constraints?: readonly DatePickerConstraint[];
  /** 모든 조작과 날짜 포커스를 비활성화합니다. */
  disabled?: boolean;
  /** 달력 이동과 날짜 포커스는 허용하되 값을 변경하지 못하게 합니다. */
  readOnly?: boolean;
  /** 루트, 이전·다음 버튼, 연도·월 Wheel의 접근성 이름을 재정의합니다. */
  ariaLabels?: Partial<DatePickerAriaLabels>;
}

interface DatePickerSelectionValueProps<Value, ChangeValue = Value> {
  /** 제어할 선택 값입니다. 값의 형태는 `selectionMode`에 따라 결정됩니다. */
  value?: Value;
  /** 제어하지 않는 방식으로 사용할 때의 초기 선택 값입니다. */
  defaultValue?: Value;
  /**
   * 선택 값이 바뀔 때 호출됩니다.
   *
   * `multiple`에서는 날짜가 오름차순으로 정렬된 배열을 전달합니다.
   */
  onValueChange?: (value: ChangeValue) => void;
}

export interface DatePickerSingleProps
  extends DatePickerCommonProps,
    DatePickerSelectionValueProps<DatePickerDate> {
  selectionMode?: "single";
  rangeStartReadOnly?: never;
}

interface DatePickerRangeBaseProps extends DatePickerCommonProps {
  selectionMode: "range";
}

type DatePickerMutableRangeProps = DatePickerRangeBaseProps &
  DatePickerSelectionValueProps<DatePickerRangeValue> & {
    rangeStartReadOnly?: false;
  };

type DatePickerReadOnlyRangeProps = DatePickerRangeBaseProps & {
  /** 현재 Range의 시작일을 유지하고 종료일만 변경할 수 있게 합니다. */
  rangeStartReadOnly: true;
  onValueChange?: (value: DatePickerRangeValue) => void;
} & (
    | {
        value: DatePickerRangeValue;
        defaultValue?: DatePickerRangeValue;
      }
    | {
        value?: undefined;
        defaultValue: DatePickerRangeValue;
      }
  );

export type DatePickerRangeProps = DatePickerMutableRangeProps | DatePickerReadOnlyRangeProps;

export interface DatePickerMultipleProps
  extends DatePickerCommonProps,
    DatePickerSelectionValueProps<readonly DatePickerDate[], DatePickerDate[]> {
  selectionMode: "multiple";
  rangeStartReadOnly?: never;
}

export type UseDatePickerProps =
  | DatePickerSingleProps
  | DatePickerRangeProps
  | DatePickerMultipleProps;

export interface DatePickerCellState {
  /** 셀이 나타내는 날짜입니다. */
  date: DatePickerDate;
  /** locale에 맞게 포맷한 날짜 숫자입니다. */
  formattedDay: string;
  /** 오늘인지 여부입니다. */
  isToday: boolean;
  /** 현재 선택에 포함되는지 여부입니다. */
  isSelected: boolean;
  /** 선택 범위의 시작일인지 여부입니다. */
  isRangeStart: boolean;
  /** 선택 범위의 종료일인지 여부입니다. */
  isRangeEnd: boolean;
  /** 시작일과 종료일 사이의 날짜인지 여부입니다. */
  isInRange: boolean;
  /** constraint에 의해 선택할 수 없는지 여부입니다. */
  isUnavailable: boolean;
  /** Range 시작일이 읽기 전용인지 여부입니다. */
  isRangeStartReadOnly: boolean;
  /** roving focus의 현재 날짜인지 여부입니다. */
  isFocused: boolean;
}

export interface DatePickerCell extends DatePickerCellState {
  key: string;
  cellProps: React.HTMLAttributes<HTMLDivElement>;
  buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export interface DatePickerWeek {
  key: string;
  cells: readonly (DatePickerCell | null)[];
}

export interface DatePickerMonth {
  key: string;
  date: DatePickerDate;
  label: string;
  weeks: readonly DatePickerWeek[];
  offset?: number;
  height?: number;
}
