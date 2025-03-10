import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { Snackbar as SnackbarPrimitive } from "@seed-design/react-snackbar";
import { snackbar, type SnackbarVariantProps } from "@seed-design/css/recipes/snackbar";
import { snackbarRegion } from "@seed-design/css/recipes/snackbar-region";
import { visuallyHidden } from "@seed-design/css/recipes/visually-hidden";
import clsx from "clsx";
import { forwardRef, useMemo } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { InternalIcon, type InternalIconProps } from "../private/Icon";

const { withProvider: withRegionProvider } = createSlotRecipeContext(snackbarRegion);
const { withProvider, withContext } = createSlotRecipeContext(snackbar);

////////////////////////////////////////////////////////////////////////////////////

export interface SnackbarRootProviderProps extends SnackbarPrimitive.RootProviderProps {}

export const SnackbarRootProvider = SnackbarPrimitive.RootProvider;

////////////////////////////////////////////////////////////////////////////////////

export interface SnackbarRegionProps extends SnackbarVariantProps, SnackbarPrimitive.RegionProps {}

export const SnackbarRegion = withRegionProvider<HTMLDivElement, SnackbarRegionProps>(
  SnackbarPrimitive.Region,
  "root",
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

export interface SnackbarCloseButtonProps extends SnackbarPrimitive.CloseButtonProps {}

/**
 * Visually hidden button that closes the snackbar (for screen readers).
 */
export const SnackbarCloseButton = forwardRef<HTMLButtonElement, SnackbarCloseButtonProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;
    const classNames = useMemo(() => visuallyHidden(), []);
    return (
      <SnackbarPrimitive.CloseButton
        ref={ref}
        className={clsx(classNames.root, className)}
        {...otherProps}
      />
    );
  },
);

////////////////////////////////////////////////////////////////////////////////////

export interface SnackbarRendererProps extends SnackbarPrimitive.RendererProps {}

export const SnackbarRenderer = SnackbarPrimitive.Renderer;

////////////////////////////////////////////////////////////////////////////////////

export interface SnackbarAvoidOverlapProps extends SnackbarPrimitive.AvoidOverlapProps {}

export const SnackbarAvoidOverlap = SnackbarPrimitive.AvoidOverlap;
