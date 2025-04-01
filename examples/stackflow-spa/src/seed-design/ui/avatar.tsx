import { Avatar as SeedAvatar } from "@seed-design/react";
import * as React from "react";

export interface AvatarProps extends SeedAvatar.RootProps {
  src?: string;

  alt?: string;

  fallback?: React.ReactNode;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, fallback, children, ...otherProps }, ref) => {
    return (
      <SeedAvatar.Root ref={ref} {...otherProps}>
        <SeedAvatar.Fallback>{fallback}</SeedAvatar.Fallback>
        <SeedAvatar.Image src={src} alt={alt} />
        {children}
      </SeedAvatar.Root>
    );
  },
);
Avatar.displayName = "Avatar";

export interface AvatarBadgeProps extends SeedAvatar.BadgeProps {}

export const AvatarBadge = SeedAvatar.Badge;

export interface AvatarStackProps extends SeedAvatar.StackProps {}

export const AvatarStack = SeedAvatar.Stack;

/**
 * This file is generated snippet from the Seed Design.
 * You can extend the functionality from this snippet if needed.
 */
