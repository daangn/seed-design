import { snackbar, type SnackbarVariantProps } from "@seed-design/css/recipes/snackbar";
import { snackbarRegion } from "@seed-design/css/recipes/snackbar-region";
import { visuallyHidden } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { Snackbar as SnackbarPrimitive } from "@seed-design/react-snackbar";
import { forwardRef } from "react";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { InternalIcon, type InternalIconProps } from "../private/Icon";

const { withContext: withRegionContext } = createRecipeContext(snackbarRegion);
const { withProvider, withContext } = createSlotRecipeContext(snackbar);

////////////////////////////////////////////////////////////////////////////////////

export interface SnackbarRootProviderProps extends SnackbarPrimitive.RootProviderProps {}

export const SnackbarRootProvider = SnackbarPrimitive.RootProvider;

////////////////////////////////////////////////////////////////////////////////////

export interface SnackbarRegionProps extends SnackbarVariantProps, SnackbarPrimitive.RegionProps {}

export const SnackbarRegion = withRegionContext<HTMLDivElement, SnackbarRegionProps>(
  SnackbarPrimitive.Region,
);

////////////////////////////////////////////////////////////////////////////////////

export interface SnackbarRootProps extends SnackbarVariantProps, SnackbarPrimitive.RootProps {}

export const SnackbarRoot = withProvider<HTMLDivElement, SnackbarRootProps>(
  SnackbarPrimitive.Root,
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SnackbarMessageProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const SnackbarMessage = withContext<HTMLDivElement, SnackbarMessageProps>(
  Primitive.span,
  "message",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SnackbarPrefixIconProps extends InternalIconProps {}

export const SnackbarPrefixIcon = withContext<HTMLDivElement, SnackbarPrefixIconProps>(
  InternalIcon,
  "prefixIcon",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SnackbarActionButtonProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const SnackbarActionButton = withContext<HTMLButtonElement, SnackbarActionButtonProps>(
  Primitive.button,
  "actionButton",
);

////////////////////////////////////////////////////////////////////////////////////

export interface SnackbarHiddenCloseButtonProps extends SnackbarPrimitive.CloseButtonProps {}

/**
 * Visually hidden button that closes the snackbar (for screen readers).
 */
export const SnackbarHiddenCloseButton = forwardRef<
  HTMLButtonElement,
  SnackbarHiddenCloseButtonProps
>((props, ref) => {
  const { style, ...otherProps } = props;
  return (
    <SnackbarPrimitive.CloseButton
      ref={ref}
      style={{ ...visuallyHidden, ...style }}
      {...otherProps}
    />
  );
});

////////////////////////////////////////////////////////////////////////////////////

export interface SnackbarRendererProps extends SnackbarPrimitive.RendererProps {}

export const SnackbarRenderer = SnackbarPrimitive.Renderer;

////////////////////////////////////////////////////////////////////////////////////

export interface SnackbarAvoidOverlapProps extends SnackbarPrimitive.AvoidOverlapProps {}

export const SnackbarAvoidOverlap = SnackbarPrimitive.AvoidOverlap;
