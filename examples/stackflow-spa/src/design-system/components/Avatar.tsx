import { useAvatar, type UseAvatarProps } from "@seed-design/react-avatar";
import { avatar, type AvatarVariantProps } from "@seed-design/recipe/avatar";
import clsx from "clsx";
import * as React from "react";

import "@seed-design/stylesheet/avatar.css";

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    UseAvatarProps,
    AvatarVariantProps {}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "20", children, ...otherProps }, ref) => {
    const { rootProps, imageProps } = useAvatar(otherProps);
    const classNames = avatar({ size });
    return (
      <div {...rootProps} className={clsx(classNames.root, className)}>
        <img {...imageProps} className={clsx(classNames.image)} />
      </div>
    );
  },
);
Avatar.displayName = "Avatar";
