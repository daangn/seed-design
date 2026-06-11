import {
  ContentPlaceholder as SeedContentPlaceholder,
  type ContentPlaceholderRootProps,
} from "@seed-design/lynx-react";

export interface ContentPlaceholderProps extends ContentPlaceholderRootProps {}

/**
 * @see https://seed-design.io/lynx/components/content-placeholder
 *
 * 웹과 달리 type 프리셋이 없으므로, asset 아이콘/이미지를 children으로 직접 넣는다.
 */
export function ContentPlaceholder({ children, ...props }: ContentPlaceholderProps) {
  return (
    <SeedContentPlaceholder.Root {...props}>
      <SeedContentPlaceholder.Asset>{children}</SeedContentPlaceholder.Asset>
    </SeedContentPlaceholder.Root>
  );
}
