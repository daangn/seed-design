/**
 * @file ui:tag-group
 * @requires @seed-design/lynx-react@~0.1.0-alpha.0
 * @requires @seed-design/lynx-css@~0.1.0-alpha.0
 **/

/**
 * @see https://seed-design.io/lynx/components/tag-group
 */
import * as React from '@lynx-js/react';
import { TagGroup as SeedTagGroup } from '@seed-design/lynx-react';

export interface TagGroupRootProps extends SeedTagGroup.RootProps {}

export const TagGroupRoot = SeedTagGroup.Root;

export interface TagGroupItemProps
  extends Omit<SeedTagGroup.ItemProps, 'children'> {
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
TagGroupItem.displayName = 'TagGroupItem';

/**
 * This file is a snippet from SEED Design, helping you get started quickly with @seed-design/* packages.
 * You can extend this snippet however you want.
 */
