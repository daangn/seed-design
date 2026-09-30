"use client";

import {
  IconChevronDownSmallLine,
  IconChevronLeftLine,
  IconChevronRightLine,
} from "@karrotmarket/react-monochrome-icon";
import { DatePicker as SeedDatePicker } from "@seed-design/react";
import * as React from "react";
import { WheelPicker, type WheelPickerColumn } from "./wheel-picker";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

type DatePickerSharedProps = DistributiveOmit<
  SeedDatePicker.RootProps,
  "children" | "asChild" | "monthRange" | "visibleRange"
>;

type ContinuousSizeConstraint =
  | (Required<Pick<SeedDatePicker.RootProps, "height">> &
      Pick<SeedDatePicker.RootProps, "minHeight" | "maxHeight">)
  | (Required<Pick<SeedDatePicker.RootProps, "minHeight">> &
      Pick<SeedDatePicker.RootProps, "height" | "maxHeight">)
  | (Required<Pick<SeedDatePicker.RootProps, "maxHeight">> &
      Pick<SeedDatePicker.RootProps, "height" | "minHeight">);

export type DatePickerCellContentRenderProps = SeedDatePicker.CellContentRenderProps;
export type DatePickerActions = SeedDatePicker.Actions;
export type DatePickerProps = DatePickerSharedProps;
export type TwoMonthDatePickerProps = DatePickerSharedProps;
export type WeekDatePickerProps = DatePickerSharedProps;
export type ContinuousDatePickerProps = DatePickerSharedProps &
  ContinuousSizeConstraint & {
    /**
     * 노출하고 이동할 수 있는 월 범위입니다. 양끝 월을 포함합니다.
     * 생략하면 `yearRange.start`의 1월부터 `yearRange.end`의 12월까지 노출합니다.
     */
    monthRange?: SeedDatePicker.RootProps["monthRange"];
  };

type DatePickerImplementationProps = DatePickerSharedProps & {
  visibleRange: SeedDatePicker.RootProps["visibleRange"];
  monthRange?: SeedDatePicker.RootProps["monthRange"];
};

function renderWheelPicker({
  rootProps,
  columns,
}: SeedDatePicker.WheelRenderProps): React.ReactNode {
  const wheelPickerColumns: readonly WheelPickerColumn[] = columns;

  return <WheelPicker {...rootProps} columns={wheelPickerColumns} />;
}

const DatePickerImplementation = React.forwardRef<HTMLDivElement, DatePickerImplementationProps>(
  ({ visibleRange, ...props }, ref) => (
    <SeedDatePicker.Root ref={ref} {...props} visibleRange={visibleRange}>
      <SeedDatePicker.Header
        leftIcon={<IconChevronLeftLine />}
        rightIcon={<IconChevronRightLine />}
        headerIcon={<IconChevronDownSmallLine />}
      />
      <SeedDatePicker.Wheel>{renderWheelPicker}</SeedDatePicker.Wheel>
      <SeedDatePicker.Calendar
        leftIcon={<IconChevronLeftLine />}
        rightIcon={<IconChevronRightLine />}
      />
    </SeedDatePicker.Root>
  ),
);
DatePickerImplementation.displayName = "DatePickerImplementation";

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>((props, ref) => (
  <DatePickerImplementation ref={ref} {...props} visibleRange="month" />
));
DatePicker.displayName = "DatePicker";

export const TwoMonthDatePicker = React.forwardRef<HTMLDivElement, TwoMonthDatePickerProps>(
  (props, ref) => <DatePickerImplementation ref={ref} {...props} visibleRange="twoMonths" />,
);
TwoMonthDatePicker.displayName = "TwoMonthDatePicker";

export const WeekDatePicker = React.forwardRef<HTMLDivElement, WeekDatePickerProps>(
  (props, ref) => <DatePickerImplementation ref={ref} {...props} visibleRange="week" />,
);
WeekDatePicker.displayName = "WeekDatePicker";

export const ContinuousDatePicker = React.forwardRef<HTMLDivElement, ContinuousDatePickerProps>(
  (props, ref) => <DatePickerImplementation ref={ref} {...props} visibleRange="continuous" />,
);
ContinuousDatePicker.displayName = "ContinuousDatePicker";
