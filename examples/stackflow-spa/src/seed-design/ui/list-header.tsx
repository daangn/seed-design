import {
  ListHeader as SeedListHeader,
  type ListHeaderProps as SeedListHeaderProps,
} from "@seed-design/react";

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListHeaderProps` instead.
 */
export interface ListHeaderProps extends SeedListHeaderProps {}

/**
 * @deprecated Deprecated in @seed-design/react@3.3.0; will be removed in 4.0.0. Use `NextListHeader` instead.
 * @see https://seed-design.io/react/components/list
 */
export const ListHeader = SeedListHeader;
