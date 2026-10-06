import * as React from "@lynx-js/react";
import { isValidElement } from "@lynx-js/react";
import type { IntrinsicElements, NodesRef } from "@lynx-js/types";
import {
  attachmentInput,
  type AttachmentInputVariantProps,
} from "@seed-design/lynx-css/recipes/attachment-input";
import {
  attachmentInputItem,
  type AttachmentInputItemVariantProps,
} from "@seed-design/lynx-css/recipes/attachment-input-item";
import {
  attachmentInputTrigger,
  type AttachmentInputTriggerVariantProps,
} from "@seed-design/lynx-css/recipes/attachment-input-trigger";
import { fieldLabel, type FieldLabelVariantProps } from "@seed-design/lynx-css/recipes/field-label";
import {
  AttachmentDisplayContext as HeadlessAttachmentDisplayContext,
  AttachmentDisplayDescription as HeadlessAttachmentDisplayDescription,
  AttachmentDisplayErrorMessage as HeadlessAttachmentDisplayErrorMessage,
  AttachmentDisplayItemBackdrop as HeadlessAttachmentDisplayItemBackdrop,
  AttachmentDisplayItemImage as HeadlessAttachmentDisplayItemImage,
  AttachmentDisplayItemProvider,
  AttachmentDisplayItemRemoveButton as HeadlessAttachmentDisplayItemRemoveButton,
  AttachmentDisplayRoot as HeadlessAttachmentDisplayRoot,
  useAttachmentDisplayContext,
  useAttachmentDisplayItem,
  useAttachmentDisplayTrigger,
  type AttachmentDisplayContextProps as HeadlessAttachmentDisplayContextProps,
  type DisplayItemEntry,
  type DisplayItemStatusDetails,
  type UseAttachmentDisplayProps,
} from "@seed-design/lynx-react-attachment-display";
import type {
  LynxAccessibilityProps,
  LynxIconElementProps,
  LynxPressableProps,
  LynxStyledElementProps,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";
import { toArray } from "../../utils/children";
import clsx from "clsx";
import { IconSlotProvider, InternalIcon } from "../Icon/Icon";

export {
  useAttachmentDisplay,
  useAttachmentDisplayContext,
  useAttachmentDisplayItemContext,
} from "@seed-design/lynx-react-attachment-display";

export type AttachmentDisplayStatusDetails = DisplayItemStatusDetails;
export type AttachmentDisplayEntry = DisplayItemEntry;
export type AttachmentDisplayProps = UseAttachmentDisplayProps;

type NativeScrollViewProps = Omit<
  IntrinsicElements["scroll-view"],
  "children" | "className" | "style"
>;

const { ClassNamesProvider: RootClassNamesProvider, useClassNames: useRootClassNames } =
  createSlotRecipeContext(attachmentInput);
const { ClassNamesProvider: TriggerClassNamesProvider, useClassNames: useTriggerClassNames } =
  createSlotRecipeContext(attachmentInputTrigger);
const { ClassNamesProvider: ItemClassNamesProvider, useClassNames: useItemClassNames } =
  createSlotRecipeContext(attachmentInputItem);
const { ClassNamesProvider: LabelClassNamesProvider, useClassNames: useLabelClassNames } =
  createSlotRecipeContext(fieldLabel);

export interface AttachmentDisplayRootProps
  extends AttachmentDisplayProps,
    AttachmentInputVariantProps,
    LynxStyledElementProps {}

/**
 * `@seed-design/lynx-react-attachment-display`의 `AttachmentDisplayRoot`에 SEED recipe를 조립합니다.
 * 항목 추가 picker는 `AttachmentDisplay.Trigger`의 `bindtap`에서 열고 결과를 `addEntries`에 전달합니다.
 */
export const AttachmentDisplayRoot = React.forwardRef<NodesRef, AttachmentDisplayRootProps>(
  (props, ref) => {
    const [variantProps, otherProps] = attachmentInput.splitVariantProps(props);
    const { children, className, ...rootProps } = otherProps;
    const classes = attachmentInput(variantProps);
    return (
      <RootClassNamesProvider value={classes}>
        <HeadlessAttachmentDisplayRoot
          ref={ref}
          {...rootProps}
          className={clsx(classes.root, className)}
        >
          {children}
        </HeadlessAttachmentDisplayRoot>
      </RootClassNamesProvider>
    );
  },
);
AttachmentDisplayRoot.displayName = "AttachmentDisplayRoot";

export interface AttachmentDisplayControlProps
  extends AttachmentInputVariantProps,
    LynxStyledElementProps {}

export const AttachmentDisplayControl = React.forwardRef<NodesRef, AttachmentDisplayControlProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const [variantProps] = attachmentInput.splitVariantProps(props);
    const classes = attachmentInput(variantProps);
    return (
      <view
        {...mergeProps(ref ? { ref } : {}, nativeProps)}
        className={clsx(classes.root, className)}
      >
        {children}
      </view>
    );
  },
);
AttachmentDisplayControl.displayName = "AttachmentDisplayControl";

export interface AttachmentDisplayContainerProps
  extends LynxStyledElementProps,
    Omit<NativeScrollViewProps, "scroll-orientation" | "scroll-bar-enable"> {}

export const AttachmentDisplayContainer = React.forwardRef<
  NodesRef,
  AttachmentDisplayContainerProps
>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classes = useRootClassNames();
  return (
    <scroll-view
      {...mergeProps(ref ? { ref } : {}, nativeProps)}
      scroll-orientation="horizontal"
      scroll-bar-enable={false}
      className={clsx(classes.container, className)}
    >
      <view className={classes.containerContent}>{children}</view>
    </scroll-view>
  );
});
AttachmentDisplayContainer.displayName = "AttachmentDisplayContainer";

export const AttachmentDisplayItemGroup = React.forwardRef<NodesRef, LynxStyledElementProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const classes = useRootClassNames();
    return (
      <view
        {...mergeProps(ref ? { ref } : {}, nativeProps)}
        className={clsx(classes.itemGroup, className)}
      >
        {children}
      </view>
    );
  },
);
AttachmentDisplayItemGroup.displayName = "AttachmentDisplayItemGroup";

export const AttachmentDisplayFooter = React.forwardRef<NodesRef, LynxStyledElementProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const context = useAttachmentDisplayContext();
    return (
      <view
        {...mergeProps(ref ? { ref } : {}, context.stateProps, nativeProps)}
        className={className}
      >
        {children}
      </view>
    );
  },
);
AttachmentDisplayFooter.displayName = "AttachmentDisplayFooter";

export const AttachmentDisplayDescription = React.forwardRef<NodesRef, LynxStyledElementProps>(
  (props, ref) => <HeadlessAttachmentDisplayDescription ref={ref} {...props} />,
);
AttachmentDisplayDescription.displayName = "AttachmentDisplayDescription";

export const AttachmentDisplayErrorMessage = React.forwardRef<NodesRef, LynxStyledElementProps>(
  (props, ref) => <HeadlessAttachmentDisplayErrorMessage ref={ref} {...props} />,
);
AttachmentDisplayErrorMessage.displayName = "AttachmentDisplayErrorMessage";

export interface AttachmentDisplayHeaderProps extends LynxStyledElementProps {}
export const AttachmentDisplayHeader = React.forwardRef<NodesRef, AttachmentDisplayHeaderProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const context = useAttachmentDisplayContext();
    return (
      <view
        {...mergeProps(ref ? { ref } : {}, context.stateProps, nativeProps)}
        className={className}
      >
        {children}
      </view>
    );
  },
);
AttachmentDisplayHeader.displayName = "AttachmentDisplayHeader";

export interface AttachmentDisplayLabelProps
  extends FieldLabelVariantProps,
    LynxStyledElementProps {}
export const AttachmentDisplayLabel = React.forwardRef<NodesRef, AttachmentDisplayLabelProps>(
  (props, ref) => {
    const [variantProps, otherProps] = fieldLabel.splitVariantProps(props);
    const { children, className, ...nativeProps } = otherProps;
    const classes = fieldLabel(variantProps);
    const context = useAttachmentDisplayContext();
    return (
      <LabelClassNamesProvider value={classes}>
        <text
          {...mergeProps(ref ? { ref } : {}, context.stateProps, nativeProps)}
          className={clsx(classes.root, className)}
        >
          {children}
        </text>
      </LabelClassNamesProvider>
    );
  },
);
AttachmentDisplayLabel.displayName = "AttachmentDisplayLabel";

export interface AttachmentDisplayIndicatorTextProps extends LynxStyledElementProps {}
export const AttachmentDisplayIndicatorText = React.forwardRef<
  NodesRef,
  AttachmentDisplayIndicatorTextProps
>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classes = useLabelClassNames();
  const context = useAttachmentDisplayContext();
  return (
    <text
      {...mergeProps(ref ? { ref } : {}, context.stateProps, nativeProps)}
      className={clsx(classes.indicatorText, className)}
    >
      {"\u00a0"}
      {children}
    </text>
  );
});
AttachmentDisplayIndicatorText.displayName = "AttachmentDisplayIndicatorText";

export interface AttachmentDisplayRequiredIndicatorProps extends LynxStyledElementProps {}
export const AttachmentDisplayRequiredIndicator = React.forwardRef<
  NodesRef,
  AttachmentDisplayRequiredIndicatorProps
>((props, ref) => {
  const { children = "*", className, ...nativeProps } = props;
  const classes = useLabelClassNames();
  const context = useAttachmentDisplayContext();
  return (
    <text
      {...mergeProps(ref ? { ref } : {}, context.stateProps, nativeProps)}
      accessibility-elements-hidden={true}
      className={clsx(classes.indicatorIcon, className)}
    >
      {"\u200a"}
      {children}
    </text>
  );
});
AttachmentDisplayRequiredIndicator.displayName = "AttachmentDisplayRequiredIndicator";

export interface AttachmentDisplayTriggerProps
  extends AttachmentInputTriggerVariantProps,
    LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {}

/**
 * `useAttachmentDisplayTrigger`의 눌림 상태·`triggerDisabled` 차단·접근성 위에 SEED recipe를 조립합니다.
 * `bindtap`에서 앱의 media picker를 열고 결과를 `useAttachmentDisplayContext().addEntries`에 전달합니다.
 */
export const AttachmentDisplayTrigger = React.forwardRef<NodesRef, AttachmentDisplayTriggerProps>(
  (props, ref) => {
    const [variantProps, restProps] = attachmentInputTrigger.splitVariantProps(props);
    const {
      children,
      className,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElement,
      "accessibility-label": accessibilityLabel,
      "accessibility-role-description": accessibilityRoleDescription = "button",
      "accessibility-traits": accessibilityTraits,
      ...nativeProps
    } = restProps;
    const context = useAttachmentDisplayContext();
    const trigger = useAttachmentDisplayTrigger({
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElement,
      "accessibility-traits": accessibilityTraits,
    });
    const classes = attachmentInputTrigger({
      ...variantProps,
      pressed: trigger.pressed,
      disabled: trigger.disabled,
    });
    return (
      <TriggerClassNamesProvider value={classes}>
        <view
          {...mergeProps(ref ? { ref } : {}, trigger.triggerProps, nativeProps, context.stateProps)}
          accessibility-label={accessibilityLabel}
          accessibility-role-description={accessibilityRoleDescription}
          flatten={false}
          className={clsx(classes.root, className)}
        >
          {children}
        </view>
      </TriggerClassNamesProvider>
    );
  },
);
AttachmentDisplayTrigger.displayName = "AttachmentDisplayTrigger";

export interface AttachmentDisplayTriggerIconProps extends LynxStyledElementProps {
  image?: React.ReactNode;
}
export const AttachmentDisplayTriggerIcon = React.forwardRef<
  NodesRef,
  AttachmentDisplayTriggerIconProps
>((props, ref) => {
  const { image, children, className, ...nativeProps } = props;
  const context = useAttachmentDisplayContext();
  const classes = useTriggerClassNames();
  const icon = image ?? children;
  if (!isValidElement<LynxIconElementProps>(icon)) return null;
  return (
    <InternalIcon
      icon={icon}
      ref={ref}
      {...nativeProps}
      className={clsx(classes.icon, className)}
      accessibility-elements-hidden={true}
      deps={[context.triggerDisabled]}
    />
  );
});
AttachmentDisplayTriggerIcon.displayName = "AttachmentDisplayTriggerIcon";

export interface AttachmentDisplayTriggerItemCountProps extends LynxStyledElementProps {}
export const AttachmentDisplayTriggerItemCount = React.forwardRef<
  NodesRef,
  AttachmentDisplayTriggerItemCountProps
>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const context = useAttachmentDisplayContext();
  const classes = useTriggerClassNames();
  return (
    <view
      {...mergeProps(ref ? { ref } : {}, nativeProps)}
      className={clsx(classes.itemCountArea, className)}
    >
      <text
        {...(context.currentEntryCount === 0 ? { "data-empty": true } : {})}
        {...context.stateProps}
        className={classes.itemCount}
      >
        {context.currentEntryCount}
      </text>
      <text {...context.stateProps} className={classes.maxItemCount}>
        /{context.maxEntries}
      </text>
      {children}
    </view>
  );
});
AttachmentDisplayTriggerItemCount.displayName = "AttachmentDisplayTriggerItemCount";

export interface AttachmentDisplayItemProps
  extends Omit<AttachmentInputItemVariantProps, "type">,
    LynxStyledElementProps {
  entry: AttachmentDisplayEntry;
}
export const AttachmentDisplayItem = React.forwardRef<NodesRef, AttachmentDisplayItemProps>(
  (props, ref) => {
    const { entry, children, className, ...restProps } = props;
    const [variantProps, nativeProps] = attachmentInputItem.splitVariantProps({
      type: "image",
      ...restProps,
    });
    const root = useAttachmentDisplayContext();
    const classes = attachmentInputItem({
      ...variantProps,
      type: "image",
      disabled: root.disabled,
      readOnly: root.readOnly,
      pressed: false,
      dragging: variantProps.dragging ?? false,
    });
    const item = useAttachmentDisplayItem(entry);
    return (
      <AttachmentDisplayItemProvider value={item}>
        <ItemClassNamesProvider value={classes}>
          <view
            {...mergeProps(ref ? { ref } : {}, root.stateProps, nativeProps)}
            className={clsx(classes.root, className)}
          >
            {children}
          </view>
        </ItemClassNamesProvider>
      </AttachmentDisplayItemProvider>
    );
  },
);
AttachmentDisplayItem.displayName = "AttachmentDisplayItem";

export const AttachmentDisplayItemSurface = React.forwardRef<NodesRef, LynxStyledElementProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const classes = useItemClassNames();
    return (
      <view
        {...mergeProps(ref ? { ref } : {}, nativeProps)}
        className={clsx(classes.surface, className)}
      >
        {children}
      </view>
    );
  },
);
AttachmentDisplayItemSurface.displayName = "AttachmentDisplayItemSurface";

export const AttachmentDisplayItemImage = React.forwardRef<NodesRef, LynxStyledElementProps>(
  (props, ref) => {
    const { className, ...nativeProps } = props;
    const classes = useItemClassNames();
    return (
      <HeadlessAttachmentDisplayItemImage
        ref={ref}
        {...nativeProps}
        className={clsx(classes.image, className)}
      />
    );
  },
);
AttachmentDisplayItemImage.displayName = "AttachmentDisplayItemImage";

export const AttachmentDisplayItemThumbnail = React.forwardRef<NodesRef, LynxStyledElementProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const classes = useItemClassNames();
    const context = useAttachmentDisplayContext();
    return (
      <IconSlotProvider
        value={{
          classNames: { icon: classes.thumbnailIcon },
          deps: [context.disabled, context.readOnly],
        }}
      >
        <view
          {...mergeProps(ref ? { ref } : {}, nativeProps)}
          className={clsx(classes.thumbnail, className)}
        >
          {children}
        </view>
      </IconSlotProvider>
    );
  },
);
AttachmentDisplayItemThumbnail.displayName = "AttachmentDisplayItemThumbnail";

export const AttachmentDisplayItemMetadata = React.forwardRef<NodesRef, LynxStyledElementProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const classes = useItemClassNames();
    return (
      <view
        {...mergeProps(ref ? { ref } : {}, nativeProps)}
        className={clsx(classes.metadata, className)}
      >
        {children}
      </view>
    );
  },
);
AttachmentDisplayItemMetadata.displayName = "AttachmentDisplayItemMetadata";

export const AttachmentDisplayItemBadge = React.forwardRef<NodesRef, LynxStyledElementProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const classes = useItemClassNames();
    return (
      <view
        {...mergeProps(ref ? { ref } : {}, nativeProps)}
        className={clsx(classes.badge, className)}
      >
        <text className={classes.badgeLabel}>{children}</text>
      </view>
    );
  },
);
AttachmentDisplayItemBadge.displayName = "AttachmentDisplayItemBadge";

export interface AttachmentDisplayItemActionButtonProps
  extends LynxStyledElementProps,
    LynxPressableProps {}
export const AttachmentDisplayItemActionButton = React.forwardRef<
  NodesRef,
  AttachmentDisplayItemActionButtonProps
>((props, ref) => {
  const {
    children,
    className,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    ...nativeProps
  } = props;
  const classes = useItemClassNames();
  const context = useAttachmentDisplayContext();
  const actionChildren = toArray(children).map((child, index) =>
    typeof child === "string" || typeof child === "number" ? (
      <text key={index} className={classes.actionLabel}>
        {child}
      </text>
    ) : (
      child
    ),
  );
  return (
    <IconSlotProvider
      value={{
        classNames: { icon: classes.actionIcon },
        deps: [context.disabled, context.readOnly],
      }}
    >
      <view
        {...mergeProps(ref ? { ref } : {}, nativeProps, {
          bindtap,
          "main-thread:bindtap": mainThreadBindtap,
        })}
        className={clsx(classes.actionButton, className)}
      >
        {actionChildren}
      </view>
    </IconSlotProvider>
  );
});
AttachmentDisplayItemActionButton.displayName = "AttachmentDisplayItemActionButton";

export interface AttachmentDisplayItemBackdropProps
  extends Omit<LynxStyledElementProps, "children"> {
  status: AttachmentDisplayEntry["status"];
  children?: React.ReactNode | ((entry: AttachmentDisplayEntry) => React.ReactNode);
}
export const AttachmentDisplayItemBackdrop = React.forwardRef<
  NodesRef,
  AttachmentDisplayItemBackdropProps
>((props, ref) => {
  const { className, ...backdropProps } = props;
  const classes = useItemClassNames();
  return (
    <HeadlessAttachmentDisplayItemBackdrop
      ref={ref}
      {...backdropProps}
      className={clsx(classes.backdrop, className)}
    />
  );
});
AttachmentDisplayItemBackdrop.displayName = "AttachmentDisplayItemBackdrop";

export interface AttachmentDisplayItemRemoveButtonProps
  extends LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {}
/**
 * `AttachmentDisplayItemRemoveButton`의 삭제·`readOnly` 차단·접근성 위에 SEED recipe와 아이콘 slot을 조립합니다.
 */
export const AttachmentDisplayItemRemoveButton = React.forwardRef<
  NodesRef,
  AttachmentDisplayItemRemoveButtonProps
>((props, ref) => {
  const {
    children,
    className,
    "accessibility-role-description": accessibilityRoleDescription = "button",
    ...removeProps
  } = props;
  const context = useAttachmentDisplayContext();
  const classes = useItemClassNames();
  return (
    <IconSlotProvider
      value={{
        classNames: { icon: classes.removeIcon },
        deps: [context.disabled, context.readOnly],
      }}
    >
      <HeadlessAttachmentDisplayItemRemoveButton
        ref={ref}
        {...removeProps}
        {...context.stateProps}
        accessibility-role-description={accessibilityRoleDescription}
        flatten={false}
        className={clsx(classes.removeButton, className)}
      >
        {children}
      </HeadlessAttachmentDisplayItemRemoveButton>
    </IconSlotProvider>
  );
});
AttachmentDisplayItemRemoveButton.displayName = "AttachmentDisplayItemRemoveButton";

export type AttachmentDisplayContextProps = HeadlessAttachmentDisplayContextProps;

export const AttachmentDisplayContext = HeadlessAttachmentDisplayContext;

export const AttachmentDisplay = {
  Root: AttachmentDisplayRoot,
  Control: AttachmentDisplayControl,
  Container: AttachmentDisplayContainer,
  ItemGroup: AttachmentDisplayItemGroup,
  Footer: AttachmentDisplayFooter,
  Header: AttachmentDisplayHeader,
  Label: AttachmentDisplayLabel,
  IndicatorText: AttachmentDisplayIndicatorText,
  RequiredIndicator: AttachmentDisplayRequiredIndicator,
  Description: AttachmentDisplayDescription,
  ErrorMessage: AttachmentDisplayErrorMessage,
  Trigger: AttachmentDisplayTrigger,
  TriggerIcon: AttachmentDisplayTriggerIcon,
  TriggerItemCount: AttachmentDisplayTriggerItemCount,
  Item: AttachmentDisplayItem,
  ItemSurface: AttachmentDisplayItemSurface,
  ItemImage: AttachmentDisplayItemImage,
  ItemThumbnail: AttachmentDisplayItemThumbnail,
  ItemMetadata: AttachmentDisplayItemMetadata,
  ItemBadge: AttachmentDisplayItemBadge,
  ItemActionButton: AttachmentDisplayItemActionButton,
  ItemBackdrop: AttachmentDisplayItemBackdrop,
  ItemRemoveButton: AttachmentDisplayItemRemoveButton,
  Context: AttachmentDisplayContext,
};
