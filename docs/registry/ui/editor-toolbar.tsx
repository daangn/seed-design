"use client";

import * as React from "react";
import {
  EditorToolbar as SeedEditorToolbar,
  type EditorToolbarRootProps,
  type EditorToolbarItemProps as SeedEditorToolbarItemProps,
  PrefixIcon,
  Icon,
} from "@seed-design/react";

export interface EditorToolbarProps extends EditorToolbarRootProps {
  children?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/editor-toolbar
 */
export const EditorToolbar = React.forwardRef<
  HTMLDivElement,
  EditorToolbarProps
>(({ children, ...otherProps }, ref) => {
  return (
    <SeedEditorToolbar.Root ref={ref} {...otherProps}>
      {children}
    </SeedEditorToolbar.Root>
  );
});
EditorToolbar.displayName = "EditorToolbar";

export interface EditorToolbarItemProps extends SeedEditorToolbarItemProps {
  children?: React.ReactNode;
}

export const EditorToolbarItem = React.forwardRef<
  HTMLButtonElement,
  EditorToolbarItemProps
>(({ children, ...otherProps }, ref) => {
  // Parse children to separate icon and label
  let prefixIcon: React.ReactNode;
  let label: React.ReactNode;
  let icon: React.ReactNode;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === PrefixIcon) {
        prefixIcon = child;
      } else if (child.type === Icon) {
        icon = child;
      } else if (typeof child === "string" || typeof child === "number") {
        label = child;
      } else {
        label = child;
      }
    } else if (typeof child === "string" || typeof child === "number") {
      label = child;
    }
  });

  const isIconOnly = otherProps.layout === "iconOnly";

  return (
    <SeedEditorToolbar.Item ref={ref} {...otherProps}>
      {isIconOnly && icon && (
        <SeedEditorToolbar.Icon svg={(icon as any).props.svg} />
      )}
      {!isIconOnly && (
        <>
          {prefixIcon && (
            <SeedEditorToolbar.PrefixIcon svg={(prefixIcon as any).props.svg} />
          )}
          {label && <SeedEditorToolbar.Label>{label}</SeedEditorToolbar.Label>}
        </>
      )}
    </SeedEditorToolbar.Item>
  );
});
EditorToolbarItem.displayName = "EditorToolbarItem";

export { PrefixIcon, Icon };
