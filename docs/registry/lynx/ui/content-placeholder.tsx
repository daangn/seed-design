import {
  ContentPlaceholder as SeedContentPlaceholder,
  type ContentPlaceholderRootProps,
} from "@seed-design/lynx-react";

export interface ContentPlaceholderProps extends ContentPlaceholderRootProps {
  /** 커스텀 이미지 컴포넌트의 원래 색상을 유지합니다. */
  preserveOriginalColor?: boolean;
}

/**
 * @see https://seed-design.io/lynx/components/content-placeholder
 *
 * 웹과 달리 type 프리셋이 없으므로, asset 아이콘/이미지를 children으로 직접 넣는다.
 */
export function ContentPlaceholder({
  children,
  preserveOriginalColor,
  ...props
}: ContentPlaceholderProps) {
  return (
    <SeedContentPlaceholder.Root {...props}>
      <SeedContentPlaceholder.Asset preserveOriginalColor={preserveOriginalColor}>
        {children}
      </SeedContentPlaceholder.Asset>
    </SeedContentPlaceholder.Root>
  );
}
