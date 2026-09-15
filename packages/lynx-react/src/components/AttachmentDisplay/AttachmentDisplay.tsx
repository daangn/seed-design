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
import type {
  LynxAccessibilityProps,
  LynxIconElementProps,
  LynxPressableProps,
  LynxStyledElementProps,
} from "../../types";
import { useControllableState } from "../../hooks/useControllableState";
import { usePressTap } from "../../hooks/usePressTap";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";
import { toArray } from "../../utils/children";
import clsx from "clsx";
import { IconSlotProvider, InternalIcon } from "../Icon/Icon";

export type AttachmentDisplayStatusDetails =
  | { status: "pending" }
  | { status: "uploading"; progress?: number }
  | { status: "success" }
  | { status: "error" };

export type AttachmentDisplayEntry = {
  id: string;
  thumbnailUrl?: string;
  name?: string;
  type?: string;
  size?: number;
} & AttachmentDisplayStatusDetails;

export interface AttachmentDisplayProps {
  entries?: AttachmentDisplayEntry[];
  defaultEntries?: AttachmentDisplayEntry[];
  onEntriesChange?: (entries: AttachmentDisplayEntry[]) => void;
  disabled?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
  required?: boolean;
  maxEntries?: number;
  onTriggerTap?: (helpers: {
    addEntries: (entries: AttachmentDisplayEntry[]) => void;
    updateEntryStatus: (id: string, details: AttachmentDisplayStatusDetails) => void;
  }) => void;
}

interface AttachmentDisplayStateProps {
  "data-disabled": boolean;
  "data-readonly": boolean;
  "data-invalid": boolean;
  "data-required": boolean;
}

interface AttachmentDisplayContextValue {
  entries: AttachmentDisplayEntry[];
  currentEntryCount: number;
  disabled: boolean;
  invalid: boolean;
  readOnly: boolean;
  required: boolean;
  maxEntries: number;
  triggerDisabled: boolean;
  stateProps: AttachmentDisplayStateProps;
  onTriggerTap?: AttachmentDisplayProps["onTriggerTap"];
  addEntries: (entries: AttachmentDisplayEntry[]) => void;
  removeEntry: (id: string) => void;
  reorderEntry: (fromIndex: number, toIndex: number) => void;
  clearEntries: () => void;
  updateEntryStatus: (id: string, details: AttachmentDisplayStatusDetails) => void;
}

type AttachmentDisplayItemContextValue = AttachmentDisplayEntry & {
  imageProps?: { src: string; alt?: string };
};

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

const DisplayContextObject = React.createContext<AttachmentDisplayContextValue | null>(null);
const DisplayItemContextObject = React.createContext<AttachmentDisplayItemContextValue | null>(
  null,
);

export function useAttachmentDisplayContext() {
  const context = React.useContext(DisplayContextObject);
  if (!context)
    throw new Error("AttachmentDisplay components must be used within AttachmentDisplay.Root");
  return context;
}

export function useAttachmentDisplayItemContext() {
  const context = React.useContext(DisplayItemContextObject);
  if (!context)
    throw new Error("AttachmentDisplay item components must be used within AttachmentDisplay.Item");
  return context;
}

function withUpdatedStatus(
  entry: AttachmentDisplayEntry,
  details: AttachmentDisplayStatusDetails,
): AttachmentDisplayEntry {
  const metadata = {
    id: entry.id,
    thumbnailUrl: entry.thumbnailUrl,
    name: entry.name,
    type: entry.type,
    size: entry.size,
  };
  return details.status === "uploading"
    ? { ...metadata, status: details.status, progress: details.progress }
    : { ...metadata, status: details.status };
}

export function useAttachmentDisplay(props: AttachmentDisplayProps = {}) {
  const {
    entries: value,
    defaultEntries = [],
    onEntriesChange,
    disabled = false,
    invalid = false,
    readOnly = false,
    required = false,
    maxEntries = 1,
    onTriggerTap,
  } = props;
  const [entries, setEntries] = useControllableState<AttachmentDisplayEntry[]>({
    value,
    defaultValue: defaultEntries,
    onChange: onEntriesChange,
  });
  const currentEntries = entries ?? [];
  const entriesRef = React.useRef(currentEntries);
  entriesRef.current = currentEntries;
  const optionsRef = React.useRef({ disabled, readOnly, maxEntries, onTriggerTap });
  optionsRef.current = { disabled, readOnly, maxEntries, onTriggerTap };
  const triggerDisabled = disabled || readOnly || currentEntries.length >= maxEntries;

  const addEntries = React.useCallback(
    (incoming: AttachmentDisplayEntry[]) => {
      const options = optionsRef.current;
      if (options.disabled || options.readOnly || incoming.length === 0) return;
      const current = entriesRef.current;
      const next =
        options.maxEntries > 1
          ? [...current, ...incoming.slice(0, Math.max(0, options.maxEntries - current.length))]
          : [incoming[0]];
      entriesRef.current = next;
      setEntries(next);
    },
    [setEntries],
  );

  const removeEntry = React.useCallback(
    (id: string) => {
      if (optionsRef.current.readOnly) return;
      const next = entriesRef.current.filter((entry) => entry.id !== id);
      entriesRef.current = next;
      setEntries(next);
    },
    [setEntries],
  );

  const clearEntries = React.useCallback(() => {
    if (optionsRef.current.readOnly) return;
    entriesRef.current = [];
    setEntries([]);
  }, [setEntries]);

  const reorderEntry = React.useCallback(
    (fromIndex: number, toIndex: number) => {
      const options = optionsRef.current;
      if (options.disabled || options.readOnly) return;
      const next = [...entriesRef.current];
      if (fromIndex < 0 || toIndex < 0 || fromIndex >= next.length || toIndex >= next.length)
        return;
      const [entry] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, entry);
      entriesRef.current = next;
      setEntries(next);
    },
    [setEntries],
  );

  const updateEntryStatus = React.useCallback(
    (id: string, details: AttachmentDisplayStatusDetails) => {
      const next = entriesRef.current.map((entry) =>
        entry.id === id ? withUpdatedStatus(entry, details) : entry,
      );
      entriesRef.current = next;
      setEntries(next);
    },
    [setEntries],
  );

  return {
    entries: currentEntries,
    currentEntryCount: currentEntries.length,
    disabled,
    invalid,
    readOnly,
    required,
    maxEntries,
    triggerDisabled,
    stateProps: {
      "data-disabled": disabled,
      "data-readonly": readOnly,
      "data-invalid": invalid,
      "data-required": required,
    },
    addEntries,
    removeEntry,
    reorderEntry,
    clearEntries,
    updateEntryStatus,
    onTriggerTap,
  } satisfies AttachmentDisplayContextValue;
}

export interface AttachmentDisplayRootProps
  extends AttachmentDisplayProps,
    AttachmentInputVariantProps,
    LynxStyledElementProps {}

export const AttachmentDisplayRoot = React.forwardRef<NodesRef, AttachmentDisplayRootProps>(
  (props, ref) => {
    const [variantProps, otherProps] = attachmentInput.splitVariantProps(props);
    const {
      children,
      className,
      entries,
      defaultEntries,
      onEntriesChange,
      disabled,
      invalid,
      readOnly,
      required,
      maxEntries,
      onTriggerTap,
      ...nativeProps
    } = otherProps;
    const api = useAttachmentDisplay({
      entries,
      defaultEntries,
      onEntriesChange,
      disabled,
      invalid,
      readOnly,
      required,
      maxEntries,
      onTriggerTap,
    });
    const classes = attachmentInput(variantProps);
    return (
      <DisplayContextObject.Provider value={api}>
        <RootClassNamesProvider value={classes}>
          <view
            {...mergeProps(ref ? { ref } : {}, api.stateProps, nativeProps)}
            className={clsx(classes.root, className)}
          >
            {children}
          </view>
        </RootClassNamesProvider>
      </DisplayContextObject.Provider>
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
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const context = useAttachmentDisplayContext();
    return (
      <text
        {...mergeProps(ref ? { ref } : {}, context.stateProps, nativeProps)}
        className={className}
      >
        {children}
      </text>
    );
  },
);
AttachmentDisplayDescription.displayName = "AttachmentDisplayDescription";

export const AttachmentDisplayErrorMessage = React.forwardRef<NodesRef, LynxStyledElementProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const context = useAttachmentDisplayContext();
    return (
      <text
        {...mergeProps(ref ? { ref } : {}, context.stateProps, nativeProps)}
        className={className}
      >
        {children}
      </text>
    );
  },
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

export const AttachmentDisplayTrigger = React.forwardRef<NodesRef, AttachmentDisplayTriggerProps>(
  (props, ref) => {
    const [variantProps, restProps] = attachmentInputTrigger.splitVariantProps(props);
    const {
      children,
      className,
      bindtap,
      "main-thread:bindtap": mainThreadBindtap,
      "accessibility-element": accessibilityElement = true,
      "accessibility-label": accessibilityLabel,
      "accessibility-role-description": accessibilityRoleDescription = "button",
      "accessibility-traits": accessibilityTraits,
      ...nativeProps
    } = restProps;
    const context = useAttachmentDisplayContext();
    const press = usePressTap({
      disabled: context.triggerDisabled,
      onTap: () =>
        context.onTriggerTap?.({
          addEntries: context.addEntries,
          updateEntryStatus: context.updateEntryStatus,
        }),
      mainThreadOnTap: mainThreadBindtap,
    });
    const classes = attachmentInputTrigger({
      ...variantProps,
      pressed: press.pressed,
      disabled: context.triggerDisabled,
    });
    return (
      <TriggerClassNamesProvider value={classes}>
        <view
          {...mergeProps(
            ref ? { ref } : {},
            press,
            { bindtap: context.triggerDisabled ? undefined : bindtap },
            nativeProps,
            context.stateProps,
          )}
          accessibility-element={accessibilityElement}
          accessibility-label={accessibilityLabel}
          accessibility-role-description={accessibilityRoleDescription}
          accessibility-traits={
            accessibilityTraits ?? (context.triggerDisabled ? "disabled" : "button")
          }
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
    const item = {
      ...entry,
      imageProps: entry.thumbnailUrl ? { src: entry.thumbnailUrl, alt: entry.name } : undefined,
    };
    return (
      <DisplayItemContextObject.Provider value={item}>
        <ItemClassNamesProvider value={classes}>
          <view
            {...mergeProps(ref ? { ref } : {}, root.stateProps, nativeProps)}
            className={clsx(classes.root, className)}
          >
            {children}
          </view>
        </ItemClassNamesProvider>
      </DisplayItemContextObject.Provider>
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
    const item = useAttachmentDisplayItemContext();
    const classes = useItemClassNames();
    if (!item.imageProps) return null;
    return (
      <image
        {...mergeProps(ref ? { ref } : {}, nativeProps)}
        src={item.imageProps.src}
        accessibility-label={item.imageProps.alt}
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
  const { status, children, className, ...nativeProps } = props;
  const entry = useAttachmentDisplayItemContext();
  const classes = useItemClassNames();
  if (entry.status !== status) return null;
  return (
    <view
      {...mergeProps(ref ? { ref } : {}, nativeProps)}
      className={clsx(classes.backdrop, className)}
    >
      {typeof children === "function" ? children(entry) : children}
    </view>
  );
});
AttachmentDisplayItemBackdrop.displayName = "AttachmentDisplayItemBackdrop";

export interface AttachmentDisplayItemRemoveButtonProps
  extends LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {}
export const AttachmentDisplayItemRemoveButton = React.forwardRef<
  NodesRef,
  AttachmentDisplayItemRemoveButtonProps
>((props, ref) => {
  const {
    children,
    className,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-role-description": accessibilityRoleDescription = "button",
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = props;
  const item = useAttachmentDisplayItemContext();
  const context = useAttachmentDisplayContext();
  const classes = useItemClassNames();
  const press = usePressTap({
    disabled: context.readOnly,
    onTap: () => context.removeEntry(item.id),
    mainThreadOnTap: mainThreadBindtap,
  });
  return (
    <IconSlotProvider
      value={{
        classNames: { icon: classes.removeIcon },
        deps: [context.disabled, context.readOnly],
      }}
    >
      <view
        {...mergeProps(
          ref ? { ref } : {},
          press,
          { bindtap: context.readOnly ? undefined : bindtap },
          nativeProps,
          context.stateProps,
        )}
        accessibility-element={accessibilityElement}
        accessibility-label={accessibilityLabel}
        accessibility-role-description={accessibilityRoleDescription}
        accessibility-traits={accessibilityTraits ?? (context.readOnly ? "disabled" : "button")}
        flatten={false}
        className={clsx(classes.removeButton, className)}
      >
        {children}
      </view>
    </IconSlotProvider>
  );
});
AttachmentDisplayItemRemoveButton.displayName = "AttachmentDisplayItemRemoveButton";

export interface AttachmentDisplayContextProps {
  children: (context: AttachmentDisplayContextValue) => React.ReactNode;
}
export const AttachmentDisplayContext = (props: AttachmentDisplayContextProps) =>
  props.children(useAttachmentDisplayContext());

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
