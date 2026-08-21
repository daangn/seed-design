declare interface TimePickerVariant {
  
}

declare type TimePickerVariantMap = {
  [key in keyof TimePickerVariant]: Array<TimePickerVariant[key]>;
};

export declare type TimePickerVariantProps = Partial<TimePickerVariant>;

export declare type TimePickerSlotName = "root" | "scrollFog" | "columns" | "selectionIndicator" | "periodColumn" | "hourColumn" | "minuteColumn" | "item";

export declare const timePickerVariantMap: TimePickerVariantMap;

export declare const timePicker: ((
  props?: TimePickerVariantProps,
) => Record<TimePickerSlotName, string>) & {
  splitVariantProps: <T extends TimePickerVariantProps>(
    props: T,
  ) => [TimePickerVariantProps, Omit<T, keyof TimePickerVariantProps>];
}