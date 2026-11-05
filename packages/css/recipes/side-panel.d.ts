declare interface SidePanelVariant {
  /**
  * @default "medium"
  */
  size: "small" | "medium" | "large";
}

declare type SidePanelVariantMap = {
  [key in keyof SidePanelVariant]: Array<SidePanelVariant[key]>;
};

export declare type SidePanelVariantProps = Partial<SidePanelVariant>;

export declare type SidePanelSlotName = "positioner" | "backdrop" | "content" | "header" | "body" | "footer" | "title" | "description" | "closeButton";

export declare const sidePanelVariantMap: SidePanelVariantMap;

export declare const sidePanel: ((
  props?: SidePanelVariantProps,
) => Record<SidePanelSlotName, string>) & {
  splitVariantProps: <T extends SidePanelVariantProps>(
    props: T,
  ) => [SidePanelVariantProps, Omit<T, keyof SidePanelVariantProps>];
}