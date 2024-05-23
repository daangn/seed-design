interface BoxButtonVariant {
  variant: "brand" | "neutral";
  size: "medium" | "xsmall"
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