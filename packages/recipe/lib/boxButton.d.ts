interface BoxButtonVariant {
  variant: "brand" | "brandSoft" | "neutral" | "danger";
  size: "xsmall" | "small" | "medium" | "large" | "xlarge"
}

type BoxButtonVariantMap = {
  [key in keyof BoxButtonVariant]: Array<BoxButtonVariant[key]>;
};

export type BoxButtonVariantProps = Partial<BoxButtonVariant>;

export type BoxButtonSlotName = "root" | "label" | "prefix";

export const boxButtonVariantMap: BoxButtonVariantMap;

export function boxButton(
  props?: BoxButtonVariantProps,
): Record<BoxButtonSlotName, string>;