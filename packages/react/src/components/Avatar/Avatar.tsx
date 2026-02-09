import { Image } from "@seed-design/react-image";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { avatar, type AvatarVariantProps } from "@seed-design/css/recipes/avatar";
import { avatarStack, type AvatarStackVariantProps } from "@seed-design/css/recipes/avatar-stack";
import clsx from "clsx";
import * as React from "react";
import { useMemo } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { PropsProvider, withProvider, withContext } = createSlotRecipeContext(avatar);

////////////////////////////////////////////////////////////////////////////////////

export interface AvatarRootProps extends AvatarVariantProps, Image.RootProps {}

export const AvatarRoot = withProvider<HTMLDivElement, AvatarRootProps>(Image.Root, "root");

////////////////////////////////////////////////////////////////////////////////////

export interface AvatarImageProps extends Image.ContentProps {}

export const AvatarImage = withContext<HTMLImageElement, AvatarImageProps>(Image.Content, "image");

////////////////////////////////////////////////////////////////////////////////////

export interface AvatarFallbackProps extends Image.FallbackProps {}

export const AvatarFallback = withContext<HTMLDivElement, AvatarFallbackProps>(
  Image.Fallback,
  "fallback",
);

////////////////////////////////////////////////////////////////////////////////////

export interface AvatarBadgeProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const AvatarBadge = withContext<HTMLDivElement, AvatarBadgeProps>(Primitive.div, "badge");

////////////////////////////////////////////////////////////////////////////////////

export interface AvatarStackProps
  extends AvatarStackVariantProps,
    React.HTMLAttributes<HTMLDivElement> {}

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
