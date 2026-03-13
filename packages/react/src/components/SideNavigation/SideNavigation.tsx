import { Collapsible } from "@seed-design/react-collapsible";
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

const { withProvider, withContext } = createSlotRecipeContext(sideNavigation);
const {
  withProvider: withMenuItemProvider,
  withRootProvider: withMenuItemRootProvider,
  withContext: withMenuItemContext,
} = createSlotRecipeContext(sideNavigationMenuItem);
const { withContext: withInsetContext } = createRecipeContext(sideNavigationInset);

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationRootProps
  extends SideNavigationVariantProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLElement> {}

export const SideNavigationRoot = withProvider<HTMLElement, SideNavigationRootProps>(
  Primitive.nav,
  "root",
);

SideNavigationRoot.displayName = "SideNavigationRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationHeader = withContext<HTMLDivElement, SideNavigationHeaderProps>(
  Primitive.div,
  "header",
);

SideNavigationHeader.displayName = "SideNavigationHeader";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationContent = withContext<HTMLDivElement, SideNavigationContentProps>(
  Primitive.div,
  "content",
);

SideNavigationContent.displayName = "SideNavigationContent";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationFooter = withContext<HTMLDivElement, SideNavigationFooterProps>(
  Primitive.div,
  "footer",
);

SideNavigationFooter.displayName = "SideNavigationFooter";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationGroupProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationGroup = withContext<HTMLDivElement, SideNavigationGroupProps>(
  Primitive.div,
  "group",
);

SideNavigationGroup.displayName = "SideNavigationGroup";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationGroupLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationGroupLabel = withContext<HTMLDivElement, SideNavigationGroupLabelProps>(
  Primitive.div,
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
>(Primitive.button, "item");

SideNavigationMenuItemButton.displayName = "SideNavigationMenuItemButton";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemCollapsibleRootProps
  extends SideNavigationMenuItemVariantProps,
    Collapsible.RootProps {}

export const SideNavigationMenuItemCollapsibleRoot =
  withMenuItemRootProvider<SideNavigationMenuItemCollapsibleRootProps>(Collapsible.Root);

SideNavigationMenuItemCollapsibleRoot.displayName = "SideNavigationMenuItemCollapsibleRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemCollapsibleTriggerProps extends Collapsible.TriggerProps {}

export const SideNavigationMenuItemCollapsibleTrigger = withMenuItemContext<
  HTMLButtonElement,
  SideNavigationMenuItemCollapsibleTriggerProps
>(Collapsible.Trigger, "item");

SideNavigationMenuItemCollapsibleTrigger.displayName = "SideNavigationMenuItemCollapsibleTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemCollapsibleContentProps extends Collapsible.ContentProps {}

export const SideNavigationMenuItemCollapsibleContent = withMenuItemContext<
  HTMLDivElement,
  SideNavigationMenuItemCollapsibleContentProps
>(Collapsible.Content, "collapsibleContent");

SideNavigationMenuItemCollapsibleContent.displayName = "SideNavigationMenuItemCollapsibleContent";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemCollapsibleItemProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const SideNavigationMenuItemCollapsibleItem = withMenuItemContext<
  HTMLButtonElement,
  SideNavigationMenuItemCollapsibleItemProps
>(Primitive.button, "item");

SideNavigationMenuItemCollapsibleItem.displayName = "SideNavigationMenuItemCollapsibleItem";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationTriggerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const SideNavigationTrigger = withContext<HTMLButtonElement, SideNavigationTriggerProps>(
  Primitive.button,
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
