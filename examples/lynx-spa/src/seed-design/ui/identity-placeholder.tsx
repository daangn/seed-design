import * as React from "@lynx-js/react";
import { IdentityPlaceholder as SeedIdentityPlaceholder } from "@seed-design/lynx-react";

export interface IdentityPlaceholderProps
  extends Omit<SeedIdentityPlaceholder.RootProps, "children"> {
  imageProps?: SeedIdentityPlaceholder.ImageProps;
}

/**
 * @see https://seed-design.io/lynx/components/identity-placeholder
 */
export const IdentityPlaceholder = React.forwardRef<unknown, IdentityPlaceholderProps>(
  ({ imageProps, ...rootProps }, ref) => {
    return (
      <SeedIdentityPlaceholder.Root ref={ref} {...rootProps}>
        <SeedIdentityPlaceholder.Image {...imageProps} />
      </SeedIdentityPlaceholder.Root>
    );
  },
);
IdentityPlaceholder.displayName = "IdentityPlaceholder";
