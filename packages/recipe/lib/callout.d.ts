interface CalloutVariant {
  variant: "outline" | "neutral" | "informative" | "warning" | "danger"
}

type CalloutVariantMap = {
  [key in keyof CalloutVariant]: Array<CalloutVariant[key]>;
};

export type CalloutVariantProps = Partial<CalloutVariant>;

export type CalloutSlotName = "root" | "icon" | "content" | "title" | "description" | "actionIndicator" | "closeButton";

export const calloutVariantMap: CalloutVariantMap;

export function callout(
  props?: CalloutVariantProps,
): Record<CalloutSlotName, string>;