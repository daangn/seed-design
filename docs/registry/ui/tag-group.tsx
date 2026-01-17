"use client";

import { PrefixIcon, TagGroup as SeedTagGroup, SuffixIcon } from "@seed-design/react";
import * as React from "react";

export interface TagGroupRootProps extends SeedTagGroup.RootProps {}

/**
 * @see https://seed-design.io/react/components/tag-group
 */
export const TagGroupRoot = SeedTagGroup.Root;

export interface TagGroupItemProps extends Omit<SeedTagGroup.ItemProps, "children"> {
  prefixIcon?: React.ReactNode;

  label: React.ReactNode;

  suffixIcon?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/tag-group
 */
export const TagGroupItem = React.forwardRef<HTMLDivElement, TagGroupItemProps>(
  ({ prefixIcon, label, suffixIcon, ...props }, ref) => {
    return (
      <SeedTagGroup.Item {...props} ref={ref}>
        {prefixIcon && <PrefixIcon svg={prefixIcon} />}
        <SeedTagGroup.Label>{label}</SeedTagGroup.Label>
        {suffixIcon && <SuffixIcon svg={suffixIcon} />}
      </SeedTagGroup.Item>
    );
  },
);
