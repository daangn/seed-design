import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { avatar, type AvatarVariantProps } from "@seed-design/lynx-css/recipes/avatar";
import {
  avatarStack,
  type AvatarStackVariantProps,
} from "@seed-design/lynx-css/recipes/avatar-stack";
import { useImage, type ImageLoadingStatus } from "@seed-design/lynx-react-image";
import clsx from "clsx";
import { toArray } from "../../utils/children";
import type { LynxViewProps, LynxViewRef } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { mergeProps } from "../../utils/merge-props";

const { ClassNamesProvider, PropsProvider, useClassNames, useProps } =
  createSlotRecipeContext(avatar);
const AvatarContext = React.createContext<{
  loadingStatus: ImageLoadingStatus;
  setLoadingStatus: (status: ImageLoadingStatus) => void;
} | null>(null);

function useAvatarContext() {
  const context = React.useContext(AvatarContext);
  if (!context) throw new Error("Avatar slots must be rendered inside Avatar.Root.");
  return context;
}

/** @platform Lynx Native view props replace DOM/asChild props. SVG badge cutouts are not supported. */
export interface AvatarRootProps extends AvatarVariantProps, LynxViewProps {
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
}

export const AvatarRoot = React.forwardRef<unknown, AvatarRootProps>((props, ref) => {
  const [variantProps, otherProps] = avatar.splitVariantProps(mergeProps(useProps() ?? {}, props));
  const { children, className, onLoadingStatusChange, ...nativeProps } = otherProps;
  const [loadingStatus, setStatus] = React.useState<ImageLoadingStatus>("error");
  const onChangeRef = React.useRef(onLoadingStatusChange);
  onChangeRef.current = onLoadingStatusChange;
  const setLoadingStatus = React.useCallback((status: ImageLoadingStatus) => {
    setStatus(status);
    onChangeRef.current?.(status);
  }, []);
  const context = React.useMemo(
    () => ({ loadingStatus, setLoadingStatus }),
    [loadingStatus, setLoadingStatus],
  );
  const classes = avatar(variantProps);
  return (
    <AvatarContext.Provider value={context}>
      <ClassNamesProvider value={classes}>
        <PropsProvider value={variantProps}>
          <view
            {...(ref ? { ref: ref as LynxViewRef } : {})}
            {...nativeProps}
            className={clsx(classes.root, className)}
          >
            {children}
            <view className={classes.stroke} accessibility-elements-hidden={true} />
          </view>
        </PropsProvider>
      </ClassNamesProvider>
    </AvatarContext.Provider>
  );
});
AvatarRoot.displayName = "AvatarRoot";

/** @platform Lynx Uses native image props; alt maps to accessibility-label. srcSet and asChild are unsupported. */
export interface AvatarImageProps extends Omit<IntrinsicElements["image"], "children"> {
  alt?: string;
}
export const AvatarImage = React.forwardRef<unknown, AvatarImageProps>((props, ref) => {
  const { src, alt, className, ...nativeProps } = props;
  const classes = useClassNames();
  const { setLoadingStatus } = useAvatarContext();
  const api = useImage({ src, onLoadingStatusChange: setLoadingStatus });
  React.useEffect(() => () => setLoadingStatus("error"), [setLoadingStatus]);
  return (
    <image
      key={src}
      {...mergeProps(
        {
          mode: "aspectFill" as const,
          "accessibility-label": alt,
          bindload: api.handleLoad,
          binderror: api.handleError,
        },
        ref ? { ref: ref as LynxViewRef } : {},
        nativeProps,
      )}
      src={src}
      className={clsx(classes.image, !api.isLoaded && classes.pendingImage, className)}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

export interface AvatarFallbackProps extends LynxViewProps {}
export const AvatarFallback = React.forwardRef<unknown, AvatarFallbackProps>(
  ({ children, className, ...nativeProps }, ref) => {
    const classes = useClassNames();
    const { loadingStatus } = useAvatarContext();
    if (loadingStatus === "loaded") return null;
    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        {...nativeProps}
        className={clsx(classes.fallback, className)}
      >
        {children}
      </view>
    );
  },
);
AvatarFallback.displayName = "AvatarFallback";

export interface AvatarBadgeProps extends LynxViewProps {}
export const AvatarBadge = React.forwardRef<unknown, AvatarBadgeProps>(
  ({ children, className, ...nativeProps }, ref) => {
    const classes = useClassNames();
    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        {...nativeProps}
        className={clsx(classes.badge, className)}
      >
        {children}
      </view>
    );
  },
);
AvatarBadge.displayName = "AvatarBadge";

export interface AvatarStackProps extends AvatarStackVariantProps, LynxViewProps {}
export const AvatarStack = React.forwardRef<unknown, AvatarStackProps>((props, ref) => {
  const [variantProps, otherProps] = avatarStack.splitVariantProps(props);
  const { children, className, ...nativeProps } = otherProps;
  const classes = avatarStack(variantProps);
  const value = React.useMemo(() => ({ size: variantProps.size ?? "48" }), [variantProps.size]);
  return (
    <PropsProvider value={value}>
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        {...nativeProps}
        className={clsx(classes.root, className)}
      >
        {toArray(children).map((child, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Wrapper order defines stacking order, matching React AvatarStack.
          <view key={index} className={clsx(classes.item, index > 0 && classes.overlap)}>
            {child}
          </view>
        ))}
      </view>
    </PropsProvider>
  );
});
AvatarStack.displayName = "AvatarStack";
