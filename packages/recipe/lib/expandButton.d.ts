interface ExpandButtonVariant {
  
}

type ExpandButtonVariantMap = {
  [key in keyof ExpandButtonVariant]: Array<ExpandButtonVariant[key]>;
};

export type ExpandButtonVariantProps = Partial<ExpandButtonVariant>;

export type ExpandButtonSlotName = "root" | "label" | "suffixIcon";

export const expandButtonVariantMap: ExpandButtonVariantMap;

export function expandButton(
  props?: ExpandButtonVariantProps,
): Record<ExpandButtonSlotName, string>;