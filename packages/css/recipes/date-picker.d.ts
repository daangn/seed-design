declare interface DatePickerVariant {
  /**
  * @default "month"
  */
  visibleRange: "month" | "twoMonths" | "continuous" | "week";
}

declare type DatePickerVariantMap = {
  [key in keyof DatePickerVariant]: Array<DatePickerVariant[key]>;
};

export declare type DatePickerVariantProps = Partial<DatePickerVariant>;

export declare type DatePickerSlotName = "root" | "header" | "headerLabel" | "headerChevron" | "navigation" | "navigationButton" | "twoMonthHeader" | "twoMonthLabel" | "twoMonthNavigationButton" | "weekdayRow" | "weekday" | "months" | "month" | "monthLabel" | "grid" | "weekRow" | "dateCell" | "dateButton" | "dateContent" | "emptyCell" | "continuousScroll" | "continuousContent" | "wheelContainer" | "wheelView" | "wheelColumns" | "wheelSelectionIndicator" | "wheelScrollFog" | "yearColumn" | "monthColumn" | "wheelItem" | "liveRegion";

export declare const datePickerVariantMap: DatePickerVariantMap;

export declare const datePicker: ((
  props?: DatePickerVariantProps,
) => Record<DatePickerSlotName, string>) & {
  splitVariantProps: <T extends DatePickerVariantProps>(
    props: T,
  ) => [DatePickerVariantProps, Omit<T, keyof DatePickerVariantProps>];
}