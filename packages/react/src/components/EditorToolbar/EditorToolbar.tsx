import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { editorToolbar, type EditorToolbarVariantProps } from "@seed-design/css/recipes/editor-toolbar";
import * as React from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { IconRequired } from "../Icon/Icon";
import { InternalIcon, type InternalIconProps } from "../private/Icon";

const { withProvider, withContext } = createSlotRecipeContext(editorToolbar);

////////////////////////////////////////////////////////////////////////////////////

export interface EditorToolbarRootProps
  extends EditorToolbarVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const EditorToolbarRoot = withProvider<HTMLDivElement, EditorToolbarRootProps>(
  Primitive.div,
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface EditorToolbarItemProps
  extends EditorToolbarVariantProps,
    PrimitiveProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Whether the item is selected
   * @default false
   */
  selected?: boolean;
}

const EditorToolbarItemBase = withContext<HTMLButtonElement, Omit<EditorToolbarItemProps, "layout" | "selected">>(
  Primitive.button,
  "item",
);

export const EditorToolbarItem = React.forwardRef<HTMLButtonElement, EditorToolbarItemProps>(
  ({ className, selected = false, children, layout, ...otherProps }, ref) => {
    const isIconOnly = layout === "iconOnly";

    if (isIconOnly && !(otherProps["aria-label"] || otherProps["aria-labelledby"])) {
      console.warn(
        "When layout is 'iconOnly', 'aria-label' or 'aria-labelledby' should be provided.",
      );
    }

    return (
      <IconRequired enabled={isIconOnly}>
        <EditorToolbarItemBase
          ref={ref}
          className={className}
          data-selected={selected || undefined}
          {...otherProps}
        >
          {children}
        </EditorToolbarItemBase>
      </IconRequired>
    );
  },
);
EditorToolbarItem.displayName = "EditorToolbarItem";

////////////////////////////////////////////////////////////////////////////////////

export interface EditorToolbarLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const EditorToolbarLabel = withContext<HTMLSpanElement, EditorToolbarLabelProps>(
  Primitive.span,
  "label",
);

////////////////////////////////////////////////////////////////////////////////////

export interface EditorToolbarIconProps extends InternalIconProps {}

export const EditorToolbarIcon = withContext<SVGSVGElement, EditorToolbarIconProps>(
  InternalIcon,
  "icon",
);

////////////////////////////////////////////////////////////////////////////////////

export interface EditorToolbarPrefixIconProps extends InternalIconProps {}

export const EditorToolbarPrefixIcon = withContext<SVGSVGElement, EditorToolbarPrefixIconProps>(
  InternalIcon,
  "prefixIcon",
);