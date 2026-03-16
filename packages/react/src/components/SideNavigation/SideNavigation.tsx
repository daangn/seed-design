import {
  SideNavigation as SideNavigationPrimitive,
  useCollapsibleContext,
  useSideNavigationContext,
} from "@seed-design/react-side-navigation";
import {
  sideNavigation,
  type SideNavigationVariantProps,
} from "@seed-design/css/recipes/side-navigation";
import {
  sideNavigationInset,
  type SideNavigationInsetVariantProps,
} from "@seed-design/css/recipes/side-navigation-inset";
import {
  sideNavigationMenuItem,
  type SideNavigationMenuItemVariantProps,
} from "@seed-design/css/recipes/side-navigation-menu-item";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createRecipeContext } from "../../utils/createRecipeContext";
import { InternalIcon, type InternalIconProps } from "../private/Icon";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { withProvider, withContext } = createSlotRecipeContext(sideNavigation);
const {
  withProvider: withMenuItemProvider,
  withRootProvider: withMenuItemRootProvider,
  withContext: withMenuItemContext,
} = createSlotRecipeContext(sideNavigationMenuItem);
const { withContext: withInsetContext } = createRecipeContext(sideNavigationInset);

const withSideNavigationStateProps = createWithStateProps([useSideNavigationContext]);
const withCollapsibleStateProps = createWithStateProps([
  { useContext: useCollapsibleContext, strict: false },
]);

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationRootProps
  extends SideNavigationVariantProps,
    SideNavigationPrimitive.RootProps {}

export const SideNavigationRoot = withProvider<HTMLElement, SideNavigationRootProps>(
  SideNavigationPrimitive.Root,
  "root",
);

SideNavigationRoot.displayName = "SideNavigationRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationHeader = withContext<HTMLDivElement, SideNavigationHeaderProps>(
  withSideNavigationStateProps(Primitive.div),
  "header",
);

SideNavigationHeader.displayName = "SideNavigationHeader";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationContent = withContext<HTMLDivElement, SideNavigationContentProps>(
  withSideNavigationStateProps(Primitive.div),
  "content",
);

SideNavigationContent.displayName = "SideNavigationContent";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationFooter = withContext<HTMLDivElement, SideNavigationFooterProps>(
  withSideNavigationStateProps(Primitive.div),
  "footer",
);

SideNavigationFooter.displayName = "SideNavigationFooter";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationGroupProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationGroup = withContext<HTMLDivElement, SideNavigationGroupProps>(
  withSideNavigationStateProps(Primitive.div),
  "group",
);

SideNavigationGroup.displayName = "SideNavigationGroup";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationGroupLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationGroupLabel = withContext<HTMLDivElement, SideNavigationGroupLabelProps>(
  withSideNavigationStateProps(Primitive.div),
  "groupLabel",
);

SideNavigationGroupLabel.displayName = "SideNavigationGroupLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemButtonProps
  extends SideNavigationMenuItemVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const SideNavigationMenuItemButton = withMenuItemProvider<
  HTMLButtonElement,
  SideNavigationMenuItemButtonProps
>(withSideNavigationStateProps(Primitive.button), "root");

SideNavigationMenuItemButton.displayName = "SideNavigationMenuItemButton";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLSpanElement> {}

export const SideNavigationMenuItemLabel = withMenuItemContext<
  HTMLSpanElement,
  SideNavigationMenuItemLabelProps
>(withSideNavigationStateProps(Primitive.span), "label");

SideNavigationMenuItemLabel.displayName = "SideNavigationMenuItemLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemPrefixIconProps extends InternalIconProps {}

export const SideNavigationMenuItemPrefixIcon = withMenuItemContext<
  SVGSVGElement,
  SideNavigationMenuItemPrefixIconProps
>(withSideNavigationStateProps(withCollapsibleStateProps(InternalIcon)), "prefixIcon");

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemSuffixIconProps extends InternalIconProps {}

export const SideNavigationMenuItemSuffixIcon = withMenuItemContext<
  SVGSVGElement,
  SideNavigationMenuItemSuffixIconProps
>(withSideNavigationStateProps(withCollapsibleStateProps(InternalIcon)), "suffixIcon");

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemCollapsibleRootProps
  extends SideNavigationMenuItemVariantProps,
    SideNavigationPrimitive.MenuItemCollapsibleRootProps {}

export const SideNavigationMenuItemCollapsibleRoot =
  withMenuItemRootProvider<SideNavigationMenuItemCollapsibleRootProps>(
    SideNavigationPrimitive.MenuItemCollapsibleRoot,
  );

SideNavigationMenuItemCollapsibleRoot.displayName = "SideNavigationMenuItemCollapsibleRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemCollapsibleTriggerProps
  extends SideNavigationPrimitive.MenuItemCollapsibleTriggerProps {}

export const SideNavigationMenuItemCollapsibleTrigger = withMenuItemContext<
  HTMLButtonElement,
  SideNavigationMenuItemCollapsibleTriggerProps
>(SideNavigationPrimitive.MenuItemCollapsibleTrigger, "root");

SideNavigationMenuItemCollapsibleTrigger.displayName = "SideNavigationMenuItemCollapsibleTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemCollapsibleContentProps
  extends SideNavigationPrimitive.MenuItemCollapsibleContentProps {}

export const SideNavigationMenuItemCollapsibleContent = withMenuItemContext<
  HTMLDivElement,
  SideNavigationMenuItemCollapsibleContentProps
>(SideNavigationPrimitive.MenuItemCollapsibleContent, "panel");

SideNavigationMenuItemCollapsibleContent.displayName = "SideNavigationMenuItemCollapsibleContent";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemCollapsibleItemProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const SideNavigationMenuItemCollapsibleItem = withMenuItemContext<
  HTMLButtonElement,
  SideNavigationMenuItemCollapsibleItemProps
>(withSideNavigationStateProps(Primitive.button), "root");

SideNavigationMenuItemCollapsibleItem.displayName = "SideNavigationMenuItemCollapsibleItem";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationTriggerProps extends SideNavigationPrimitive.TriggerProps {}

export const SideNavigationTrigger = withContext<HTMLButtonElement, SideNavigationTriggerProps>(
  SideNavigationPrimitive.Trigger,
  "trigger",
);

SideNavigationTrigger.displayName = "SideNavigationTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationInsetProps
  extends SideNavigationInsetVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationInset = withInsetContext<HTMLDivElement, SideNavigationInsetProps>(
  Primitive.div,
);
