import { IconCheckmarkClipboardLine, IconCheckmarkFill } from "@karrotmarket/react-monochrome-icon";

interface ColorSwatchProps {
  identifier: string;
  lightValue: string;
  darkValue: string;
}

/**
 * 팔레트 색 칸. 칸 버튼 뒤에 backdrop 버튼과 popup을 `hidden`으로 정적으로 그린다. 열고 닫기와 popup 위치는
 * `color-swatch` widget(`src/mdx/widgets.ts`)이, 값 복사는 `copy` widget이 맡는다. popup은 본문 `prose` 안에 있으므로
 * `not-prose`로 기존 portal(body 아래)과 같은 조판을 쓴다.
 */
export function ColorSwatch({ identifier, lightValue, darkValue }: ColorSwatchProps) {
  const label = identifier.replace("$color.palette.", "");

  return (
    <div data-widget="color-swatch" className="contents">
      <button
        type="button"
        data-swatch=""
        className="flex-1 h-12 border border-fd-border/20 data-open:border-fd-primary cursor-pointer hover:opacity-90 transition-opacity"
        style={{ backgroundColor: lightValue }}
        title={label}
        aria-label={`${label} 색상 정보 열기`}
      />
      <button
        type="button"
        data-swatch-backdrop=""
        hidden
        className="fixed inset-0 z-40 cursor-default"
        aria-label="닫기"
      />
      <div
        data-swatch-popup=""
        hidden
        className="not-prose fixed z-50 top-(--swatch-top,0px) left-(--swatch-left,0px) right-(--swatch-right,auto) bg-fd-background border border-fd-border rounded-xl shadow-xl p-4 min-w-52"
      >
        <p className="text-sm font-semibold mb-3">{label}</p>
        <CopyRow label="Light" value={lightValue} />
        <CopyRow label="Dark" value={darkValue} />
      </div>
    </div>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  return (
    <button
      type="button"
      data-widget="copy"
      data-copy-text={value}
      className="flex items-center gap-2 w-full py-1.5 text-left hover:bg-fd-muted rounded-md px-1 transition-colors group/copy"
    >
      <div
        className="w-5 h-5 rounded-md border border-fd-border/50 flex-none"
        style={{ backgroundColor: value }}
      />
      <span className="text-xs text-fd-muted-foreground flex-none w-8">{label}</span>
      <code className="text-xs flex-1 font-mono">{value}</code>
      <IconCheckmarkFill size={14} className="hidden flex-none group-data-copied/copy:block" />
      <IconCheckmarkClipboardLine
        size={14}
        className="flex-none opacity-0 group-hover/copy:opacity-100 group-data-copied/copy:hidden transition-opacity text-fd-muted-foreground"
      />
    </button>
  );
}
