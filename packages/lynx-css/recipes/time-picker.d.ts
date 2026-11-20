declare interface TimePickerVariant {
  /**
  * @default "period"
  */
  columnType: "period" | "hour" | "minute";
}

declare type TimePickerVariantMap = {
  [key in keyof TimePickerVariant]: Array<TimePickerVariant[key]>;
};

export declare type TimePickerVariantProps = Partial<TimePickerVariant>;

export declare type TimePickerSlotName = "itemLabel";

export declare const timePickerVariantMap: TimePickerVariantMap;

export declare const timePicker: ((
  props?: TimePickerVariantProps,
) => Record<TimePickerSlotName, string>) & {
  splitVariantProps: <T extends TimePickerVariantProps>(
    props: T,
  ) => [TimePickerVariantProps, Omit<T, keyof TimePickerVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const timePickerSeedTagSpec: {
  readonly name: "TimePicker";
  readonly axes: readonly [];
  readonly defaults: {};
};
