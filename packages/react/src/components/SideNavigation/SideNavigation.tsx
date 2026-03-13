import { Collapsible } from "@seed-design/react-collapsible";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { forwardRef } from "react";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationRootProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLElement> {}

export const SideNavigationRoot = forwardRef<HTMLElement, SideNavigationRootProps>((props, ref) => {
  return <Primitive.nav ref={ref} {...props} />;
});

SideNavigationRoot.displayName = "SideNavigationRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationHeaderProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationHeader = forwardRef<HTMLDivElement, SideNavigationHeaderProps>(
  (props, ref) => {
    return <Primitive.div ref={ref} {...props} />;
  },
);

SideNavigationHeader.displayName = "SideNavigationHeader";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationContent = forwardRef<HTMLDivElement, SideNavigationContentProps>(
  (props, ref) => {
    return <Primitive.div ref={ref} {...props} />;
  },
);

SideNavigationContent.displayName = "SideNavigationContent";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationFooter = forwardRef<HTMLDivElement, SideNavigationFooterProps>(
  (props, ref) => {
    return <Primitive.div ref={ref} {...props} />;
  },
);

SideNavigationFooter.displayName = "SideNavigationFooter";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationGroupProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationGroup = forwardRef<HTMLDivElement, SideNavigationGroupProps>(
  (props, ref) => {
    return <Primitive.div ref={ref} {...props} />;
  },
);

SideNavigationGroup.displayName = "SideNavigationGroup";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationGroupLabelProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationGroupLabel = forwardRef<HTMLDivElement, SideNavigationGroupLabelProps>(
  (props, ref) => {
    return <Primitive.div ref={ref} {...props} />;
  },
);

SideNavigationGroupLabel.displayName = "SideNavigationGroupLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuGroupProps extends Collapsible.RootProps {}

export const SideNavigationMenuGroup = forwardRef<HTMLDivElement, SideNavigationMenuGroupProps>(
  (props, ref) => {
    return <Collapsible.Root ref={ref} {...props} />;
  },
);

SideNavigationMenuGroup.displayName = "SideNavigationMenuGroup";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuGroupContentProps extends Collapsible.ContentProps {}

export const SideNavigationMenuGroupContent = forwardRef<
  HTMLDivElement,
  SideNavigationMenuGroupContentProps
>((props, ref) => {
  return <Collapsible.Content ref={ref} {...props} />;
});

SideNavigationMenuGroupContent.displayName = "SideNavigationMenuGroupContent";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const SideNavigationMenuItem = forwardRef<HTMLButtonElement, SideNavigationMenuItemProps>(
  (props, ref) => {
    return <Primitive.button ref={ref} {...props} />;
  },
);

SideNavigationMenuItem.displayName = "SideNavigationMenuItem";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemTriggerProps extends Collapsible.TriggerProps {}

export const SideNavigationMenuItemTrigger = forwardRef<
  HTMLButtonElement,
  SideNavigationMenuItemTriggerProps
>((props, ref) => {
  return <Collapsible.Trigger ref={ref} {...props} />;
});

SideNavigationMenuItemTrigger.displayName = "SideNavigationMenuItemTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuSubItemProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const SideNavigationMenuSubItem = forwardRef<
  HTMLButtonElement,
  SideNavigationMenuSubItemProps
>((props, ref) => {
  return <Primitive.button ref={ref} {...props} />;
});

SideNavigationMenuSubItem.displayName = "SideNavigationMenuSubItem";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationTriggerProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const SideNavigationTrigger = forwardRef<HTMLButtonElement, SideNavigationTriggerProps>(
  (props, ref) => {
    return <Primitive.button ref={ref} {...props} />;
  },
);

SideNavigationTrigger.displayName = "SideNavigationTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationInsetProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SideNavigationInset = forwardRef<HTMLDivElement, SideNavigationInsetProps>(
  (props, ref) => {
    return <Primitive.div ref={ref} {...props} />;
  },
);

SideNavigationInset.displayName = "SideNavigationInset";
