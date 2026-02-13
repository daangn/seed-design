"use client";

import { ContentPlaceholder as SeedContentPlaceholder } from "@seed-design/react";
import * as React from "react";

type ContentPlaceholderPresetProps = {
  type?: SeedContentPlaceholder.AssetType;
  svg?: never;
};

type ContentPlaceholderCustomProps = {
  svg: React.ReactNode;
  type?: never;
};

export type ContentPlaceholderProps = Omit<SeedContentPlaceholder.RootProps, "children"> &
  (ContentPlaceholderPresetProps | ContentPlaceholderCustomProps);

/**
 * @see https://seed-design.io/react/components/content-placeholder
 */
export const ContentPlaceholder = React.forwardRef<HTMLDivElement, ContentPlaceholderProps>(
  ({ type = "default", svg, ...props }, ref) => {
    return (
      <SeedContentPlaceholder.Root {...props} ref={ref}>
        <SeedContentPlaceholder.Container>
          {svg !== undefined ? (
            <SeedContentPlaceholder.Asset svg={svg} />
          ) : (
            <SeedContentPlaceholder.Asset type={type} />
          )}
        </SeedContentPlaceholder.Container>
      </SeedContentPlaceholder.Root>
    );
  },
);
ContentPlaceholder.displayName = "ContentPlaceholder";
