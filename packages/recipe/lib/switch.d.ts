interface SwitchVariant {
  
}

type SwitchVariantMap = {
  [key in keyof SwitchVariant]: Array<SwitchVariant[key]>;
};

export type SwitchVariantProps = Partial<SwitchVariant>;

export type SwitchSlotName = "root" | "control" | "thumb";

export const switchVariantMap: SwitchVariantMap;

export function switchStyle(
  props?: SwitchVariantProps,
): Record<SwitchSlotName, string>;