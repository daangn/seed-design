/**
 * @file ui:tag-group
 * @requires @seed-design/lynx-react@~0.1.0-alpha.0
 * @requires @seed-design/lynx-css@~0.1.0-alpha.0
 **/

/**
 * @see https://seed-design.io/lynx/components/tag-group
 */
import { TagGroup as SeedTagGroup } from "@seed-design/lynx-react";

export interface TagGroupRootProps extends SeedTagGroup.RootProps {}

export const TagGroupRoot = SeedTagGroup.Root;

export interface TagGroupItemProps extends SeedTagGroup.ItemProps {}

export const TagGroupItem = SeedTagGroup.Item;

export interface TagGroupItemLabelProps extends SeedTagGroup.ItemLabelProps {}

export const TagGroupItemLabel = SeedTagGroup.ItemLabel;

/**
 * This file is a snippet from SEED Design, helping you get started quickly with @seed-design/* packages.
 * You can extend this snippet however you want.
 */
