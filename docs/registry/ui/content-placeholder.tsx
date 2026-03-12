"use client";

import { ContentPlaceholder as SeedContentPlaceholder } from "@seed-design/react";
import * as React from "react";

export type ContentPlaceholderProps = SeedContentPlaceholder.Props;

/**
 * @see https://seed-design.io/react/components/content-placeholder
 */
export const ContentPlaceholder = React.forwardRef<HTMLDivElement, ContentPlaceholderProps>(
  ({ type, svg, ...props }, ref) => {
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
