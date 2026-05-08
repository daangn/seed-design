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
