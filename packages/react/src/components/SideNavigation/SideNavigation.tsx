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

export interface SideNavigationMenuItemButtonProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const SideNavigationMenuItemButton = forwardRef<
  HTMLButtonElement,
  SideNavigationMenuItemButtonProps
>((props, ref) => {
  return <Primitive.button ref={ref} {...props} />;
});

SideNavigationMenuItemButton.displayName = "SideNavigationMenuItemButton";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemCollapsibleRootProps extends Collapsible.RootProps {}

export const SideNavigationMenuItemCollapsibleRoot = forwardRef<
  HTMLDivElement,
  SideNavigationMenuItemCollapsibleRootProps
>((props, ref) => {
  return <Collapsible.Root ref={ref} {...props} />;
});

SideNavigationMenuItemCollapsibleRoot.displayName = "SideNavigationMenuItemCollapsibleRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemCollapsibleTriggerProps extends Collapsible.TriggerProps {}

export const SideNavigationMenuItemCollapsibleTrigger = forwardRef<
  HTMLButtonElement,
  SideNavigationMenuItemCollapsibleTriggerProps
>((props, ref) => {
  return <Collapsible.Trigger ref={ref} {...props} />;
});

SideNavigationMenuItemCollapsibleTrigger.displayName = "SideNavigationMenuItemCollapsibleTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemCollapsibleContentProps extends Collapsible.ContentProps {}

export const SideNavigationMenuItemCollapsibleContent = forwardRef<
  HTMLDivElement,
  SideNavigationMenuItemCollapsibleContentProps
>((props, ref) => {
  return <Collapsible.Content ref={ref} {...props} />;
});

SideNavigationMenuItemCollapsibleContent.displayName = "SideNavigationMenuItemCollapsibleContent";

////////////////////////////////////////////////////////////////////////////////////

export interface SideNavigationMenuItemCollapsibleItemProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const SideNavigationMenuItemCollapsibleItem = forwardRef<
  HTMLButtonElement,
  SideNavigationMenuItemCollapsibleItemProps
>((props, ref) => {
  return <Primitive.button ref={ref} {...props} />;
});

SideNavigationMenuItemCollapsibleItem.displayName = "SideNavigationMenuItemCollapsibleItem";

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
