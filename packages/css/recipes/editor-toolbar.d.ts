declare interface EditorToolbarVariant {
  /**
  * @default iconWithText
  */
  layout: "iconWithText" | "iconOnly";
/**
  * @default false
  */
  showKeyboard: boolean;
}

declare type EditorToolbarVariantMap = {
  [key in keyof EditorToolbarVariant]: Array<EditorToolbarVariant[key]>;
};

export declare type EditorToolbarVariantProps = Partial<EditorToolbarVariant>;

export declare type EditorToolbarSlotName = "root" | "item" | "label" | "icon" | "prefixIcon";

export declare const editorToolbarVariantMap: EditorToolbarVariantMap;

export declare const editorToolbar: ((
  props?: EditorToolbarVariantProps,
) => Record<EditorToolbarSlotName, string>) & {
  splitVariantProps: <T extends EditorToolbarVariantProps>(
    props: T,
  ) => [EditorToolbarVariantProps, Omit<T, keyof EditorToolbarVariantProps>];
}