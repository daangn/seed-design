import * as React from "@lynx-js/react";
import { Avatar as SeedAvatar } from "@seed-design/lynx-react";

export interface AvatarProps extends SeedAvatar.RootProps {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  /** Native image events, accessibility and decoding props. */
  imageProps?: Omit<SeedAvatar.ImageProps, "src" | "alt">;
}

/** @see https://seed-design.io/lynx/components/avatar */
export const Avatar = React.forwardRef<unknown, AvatarProps>(
  ({ src, alt, fallback, imageProps, children, ...otherProps }, ref) => (
    <SeedAvatar.Root {...(ref ? { ref } : {})} {...otherProps}>
      <SeedAvatar.Fallback>
        {typeof fallback === "string" || typeof fallback === "number" ? (
          <text>{fallback}</text>
        ) : (
          fallback
        )}
      </SeedAvatar.Fallback>
      <SeedAvatar.Image src={src} alt={alt} {...imageProps} />
      {children}
    </SeedAvatar.Root>
  ),
);
Avatar.displayName = "Avatar";

export interface AvatarBadgeProps extends SeedAvatar.BadgeProps {}
export const AvatarBadge = SeedAvatar.Badge;
export interface AvatarStackProps extends SeedAvatar.StackProps {}
export const AvatarStack = SeedAvatar.Stack;
