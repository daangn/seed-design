import {
  ContentPlaceholder as SeedContentPlaceholder,
  type ContentPlaceholderRootProps,
} from "@seed-design/lynx-react";

export interface ContentPlaceholderProps extends ContentPlaceholderRootProps {}

/** @see https://seed-design.io/lynx/components/content-placeholder */
export function ContentPlaceholder({ children, ...props }: ContentPlaceholderProps) {
  return (
    <SeedContentPlaceholder.Root {...props}>
      <SeedContentPlaceholder.Asset>{children}</SeedContentPlaceholder.Asset>
    </SeedContentPlaceholder.Root>
  );
}
