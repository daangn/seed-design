interface ActionButtonVariant {
  variant: "brandSolid" | "brandWeak" | "neutralSolid" | "neutralWeak" | "dangerSolid";
  size: "xsmall" | "small" | "medium" | "large";
  layout: "withText" | "iconOnly"
}

type ActionButtonVariantMap = {
  [key in keyof ActionButtonVariant]: Array<ActionButtonVariant[key]>;
};

export type ActionButtonVariantProps = Partial<ActionButtonVariant>;

export type ActionButtonSlotName = "root" | "label" | "icon" | "prefixIcon" | "suffixIcon";

export const actionButtonVariantMap: ActionButtonVariantMap;

export function actionButton(
  props?: ActionButtonVariantProps,
): Record<ActionButtonSlotName, string>;