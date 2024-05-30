interface DialogVariant {
  footerLayout: "horizontal" | "vertical"
}

type DialogVariantMap = {
  [key in keyof DialogVariant]: Array<DialogVariant[key]>;
};

export type DialogVariantProps = Partial<DialogVariant>;

export type DialogSlotName = "backdrop" | "container" | "content" | "header" | "footer" | "action" | "title" | "description";

export const dialogVariantMap: DialogVariantMap;

export function dialog(
  props?: DialogVariantProps,
): Record<DialogSlotName, string>;