import { Avatar as AvatarPrimitive } from "@seed-design/react-avatar";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { avatar, type AvatarVariantProps } from "@seed-design/css/recipes/avatar";
import { avatarStack, type AvatarStackVariantProps } from "@seed-design/css/recipes/avatar-stack";
import clsx from "clsx";
import * as React from "react";
import { useMemo } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { PropsProvider, withProvider, withContext } = createSlotRecipeContext(avatar);

////////////////////////////////////////////////////////////////////////////////////

export interface AvatarRootProps extends AvatarVariantProps, AvatarPrimitive.RootProps {}

export const AvatarRoot = withProvider<HTMLDivElement, AvatarRootProps>(
  AvatarPrimitive.Root,
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface AvatarImageProps extends AvatarPrimitive.ImageProps {}

export const AvatarImage = withContext<HTMLImageElement, AvatarImageProps>(
  AvatarPrimitive.Image,
  "image",
);

////////////////////////////////////////////////////////////////////////////////////

export interface AvatarFallbackProps extends AvatarPrimitive.FallbackProps {}

export const AvatarFallback = withContext<HTMLDivElement, AvatarFallbackProps>(
  AvatarPrimitive.Fallback,
  "fallback",
);

////////////////////////////////////////////////////////////////////////////////////

export interface AvatarBadgeProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const AvatarBadge = withContext<HTMLDivElement, AvatarBadgeProps>(Primitive.div, "badge");

////////////////////////////////////////////////////////////////////////////////////

export interface AvatarStackProps
  extends AvatarStackVariantProps,
    React.HTMLAttributes<HTMLDivElement> {}

// TODO: implement stacking order
export const AvatarStack = React.forwardRef<HTMLDivElement, AvatarStackProps>(
  ({ className, children, size, ...otherProps }, ref) => {
    const classNames = avatarStack({ size });
    const avatars = React.Children.toArray(children);
    return (
      <PropsProvider value={useMemo(() => ({ size }), [size])}>
        <div ref={ref} className={clsx(classNames.root, className)} {...otherProps}>
          {avatars.map((avatar, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: There is no unique key for each child
            <div key={index} className={classNames.item}>
              {avatar}
            </div>
          ))}
        </div>
      </PropsProvider>
    );
  },
);
