"use client";

import { IdentityPlaceholder as SeedIdentityPlaceholder } from "@seed-design/react";
import * as React from "react";

export interface IdentityPlaceholderProps
  extends SeedIdentityPlaceholder.RootProps {}

/**
 * @see https://seed-design.io/docs/react/components/identity-placeholder
 */
export const IdentityPlaceholder = React.forwardRef<
  HTMLDivElement,
  IdentityPlaceholderProps
>((props, ref) => {
  return (
    <SeedIdentityPlaceholder.Root {...props} ref={ref}>
      <SeedIdentityPlaceholder.Image />
    </SeedIdentityPlaceholder.Root>
  );
});
IdentityPlaceholder.displayName = "IdentityPlaceholder";
