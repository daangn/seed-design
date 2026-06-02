/**
 * @see https://seed-design.io/lynx/components/tag-group
 */
import * as React from "@lynx-js/react";
import { TagGroup as SeedTagGroup } from "@seed-design/lynx-react";

export interface TagGroupRootProps extends SeedTagGroup.RootProps {}

export const TagGroupRoot = SeedTagGroup.Root;

export interface TagGroupItemProps extends Omit<SeedTagGroup.ItemProps, "children"> {
  label: React.ReactNode;
}

export const TagGroupItem = React.forwardRef<unknown, TagGroupItemProps>(
  ({ label, ...props }, ref) => {
    return (
      <SeedTagGroup.Item {...props} ref={ref}>
        <SeedTagGroup.ItemLabel>{label}</SeedTagGroup.ItemLabel>
      </SeedTagGroup.Item>
    );
  },
);
TagGroupItem.displayName = "TagGroupItem";
