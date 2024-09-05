interface ActionButtonVariant {
  variant: "brand" | "brandWeak" | "neutralWeak" | "danger";
  size: "xsmall" | "small" | "medium" | "large"
}

type ActionButtonVariantMap = {
  [key in keyof ActionButtonVariant]: Array<ActionButtonVariant[key]>;
};

export type ActionButtonVariantProps = Partial<ActionButtonVariant>;

export type ActionButtonSlotName = "root" | "label" | "prefix";

export const actionButtonVariantMap: ActionButtonVariantMap;

export function actionButton(
  props?: ActionButtonVariantProps,
): Record<ActionButtonSlotName, string>;