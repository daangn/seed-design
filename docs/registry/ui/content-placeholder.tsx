"use client";

import { ContentPlaceholder as SeedContentPlaceholder } from "@seed-design/react";
import * as React from "react";

type ContentPlaceholderPresetProps = {
  type?: SeedContentPlaceholder.AssetType;
  icon?: never;
};

type ContentPlaceholderCustomProps = {
  icon: React.ReactNode;
  type?: never;
};

export type ContentPlaceholderProps = Omit<SeedContentPlaceholder.RootProps, "children"> &
  (ContentPlaceholderPresetProps | ContentPlaceholderCustomProps);

/**
 * @see https://seed-design.io/react/components/content-placeholder
 */
export const ContentPlaceholder = React.forwardRef<HTMLDivElement, ContentPlaceholderProps>(
  ({ type = "default", icon, ...props }, ref) => {
    return (
      <SeedContentPlaceholder.Root {...props} ref={ref}>
        <SeedContentPlaceholder.Container>
          {icon ? (
            <SeedContentPlaceholder.Asset svg={icon} />
          ) : (
            <SeedContentPlaceholder.Asset type={type} />
          )}
        </SeedContentPlaceholder.Container>
      </SeedContentPlaceholder.Root>
    );
  },
);
ContentPlaceholder.displayName = "ContentPlaceholder";
