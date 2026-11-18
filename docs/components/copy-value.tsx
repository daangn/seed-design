import { IconCheckmarkClipboardLine, IconCheckmarkFill } from "@karrotmarket/react-monochrome-icon";

/**
 * 값을 누르면 복사하는 버튼. 정적 마크업이고 동작은 `copy` widget(`src/mdx/widgets.ts`)이 `data-copy-text`로 붙인다.
 * 복사 뒤 widget이 붙이는 `data-copied`로 아이콘을 바꾼다.
 */
export function CopyValue({ value }: { value: string }) {
  return (
    <button
      type="button"
      data-widget="copy"
      data-copy-text={value}
      className="flex items-center gap-1 group/copy"
    >
      <span>{value}</span>
      <IconCheckmarkFill size={12} className="hidden flex-none group-data-copied/copy:block" />
      <IconCheckmarkClipboardLine
        size={12}
        className="flex-none opacity-0 group-hover/copy:opacity-100 group-data-copied/copy:hidden transition-opacity text-fd-muted-foreground"
      />
    </button>
  );
}
