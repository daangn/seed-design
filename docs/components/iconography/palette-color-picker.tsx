"use client";

import clsx from "clsx";
import { useIcon } from "./icon-context";

interface PaletteColor {
  tokenName: string;
  cssVar: string;
}

const COLOR_FAMILIES: Record<string, PaletteColor[]> = {
  gray: [
    { tokenName: "gray00", cssVar: "var(--seed-color-palette-gray-00)" },
    { tokenName: "gray100", cssVar: "var(--seed-color-palette-gray-100)" },
    { tokenName: "gray200", cssVar: "var(--seed-color-palette-gray-200)" },
    { tokenName: "gray300", cssVar: "var(--seed-color-palette-gray-300)" },
    { tokenName: "gray400", cssVar: "var(--seed-color-palette-gray-400)" },
    { tokenName: "gray500", cssVar: "var(--seed-color-palette-gray-500)" },
    { tokenName: "gray600", cssVar: "var(--seed-color-palette-gray-600)" },
    { tokenName: "gray700", cssVar: "var(--seed-color-palette-gray-700)" },
    { tokenName: "gray800", cssVar: "var(--seed-color-palette-gray-800)" },
    { tokenName: "gray900", cssVar: "var(--seed-color-palette-gray-900)" },
    { tokenName: "gray1000", cssVar: "var(--seed-color-palette-gray-1000)" },
  ],
  carrot: [
    { tokenName: "carrot100", cssVar: "var(--seed-color-palette-carrot-100)" },
    { tokenName: "carrot200", cssVar: "var(--seed-color-palette-carrot-200)" },
    { tokenName: "carrot300", cssVar: "var(--seed-color-palette-carrot-300)" },
    { tokenName: "carrot400", cssVar: "var(--seed-color-palette-carrot-400)" },
    { tokenName: "carrot500", cssVar: "var(--seed-color-palette-carrot-500)" },
    { tokenName: "carrot600", cssVar: "var(--seed-color-palette-carrot-600)" },
    { tokenName: "carrot700", cssVar: "var(--seed-color-palette-carrot-700)" },
    { tokenName: "carrot800", cssVar: "var(--seed-color-palette-carrot-800)" },
    { tokenName: "carrot900", cssVar: "var(--seed-color-palette-carrot-900)" },
    { tokenName: "carrot1000", cssVar: "var(--seed-color-palette-carrot-1000)" },
  ],
  blue: [
    { tokenName: "blue100", cssVar: "var(--seed-color-palette-blue-100)" },
    { tokenName: "blue200", cssVar: "var(--seed-color-palette-blue-200)" },
    { tokenName: "blue300", cssVar: "var(--seed-color-palette-blue-300)" },
    { tokenName: "blue400", cssVar: "var(--seed-color-palette-blue-400)" },
    { tokenName: "blue500", cssVar: "var(--seed-color-palette-blue-500)" },
    { tokenName: "blue600", cssVar: "var(--seed-color-palette-blue-600)" },
    { tokenName: "blue700", cssVar: "var(--seed-color-palette-blue-700)" },
    { tokenName: "blue800", cssVar: "var(--seed-color-palette-blue-800)" },
    { tokenName: "blue900", cssVar: "var(--seed-color-palette-blue-900)" },
    { tokenName: "blue1000", cssVar: "var(--seed-color-palette-blue-1000)" },
  ],
  red: [
    { tokenName: "red100", cssVar: "var(--seed-color-palette-red-100)" },
    { tokenName: "red200", cssVar: "var(--seed-color-palette-red-200)" },
    { tokenName: "red300", cssVar: "var(--seed-color-palette-red-300)" },
    { tokenName: "red400", cssVar: "var(--seed-color-palette-red-400)" },
    { tokenName: "red500", cssVar: "var(--seed-color-palette-red-500)" },
    { tokenName: "red600", cssVar: "var(--seed-color-palette-red-600)" },
    { tokenName: "red700", cssVar: "var(--seed-color-palette-red-700)" },
    { tokenName: "red800", cssVar: "var(--seed-color-palette-red-800)" },
    { tokenName: "red900", cssVar: "var(--seed-color-palette-red-900)" },
    { tokenName: "red1000", cssVar: "var(--seed-color-palette-red-1000)" },
  ],
  green: [
    { tokenName: "green100", cssVar: "var(--seed-color-palette-green-100)" },
    { tokenName: "green200", cssVar: "var(--seed-color-palette-green-200)" },
    { tokenName: "green300", cssVar: "var(--seed-color-palette-green-300)" },
    { tokenName: "green400", cssVar: "var(--seed-color-palette-green-400)" },
    { tokenName: "green500", cssVar: "var(--seed-color-palette-green-500)" },
    { tokenName: "green600", cssVar: "var(--seed-color-palette-green-600)" },
    { tokenName: "green700", cssVar: "var(--seed-color-palette-green-700)" },
    { tokenName: "green800", cssVar: "var(--seed-color-palette-green-800)" },
    { tokenName: "green900", cssVar: "var(--seed-color-palette-green-900)" },
    { tokenName: "green1000", cssVar: "var(--seed-color-palette-green-1000)" },
  ],
  yellow: [
    { tokenName: "yellow100", cssVar: "var(--seed-color-palette-yellow-100)" },
    { tokenName: "yellow200", cssVar: "var(--seed-color-palette-yellow-200)" },
    { tokenName: "yellow300", cssVar: "var(--seed-color-palette-yellow-300)" },
    { tokenName: "yellow400", cssVar: "var(--seed-color-palette-yellow-400)" },
    { tokenName: "yellow500", cssVar: "var(--seed-color-palette-yellow-500)" },
    { tokenName: "yellow600", cssVar: "var(--seed-color-palette-yellow-600)" },
    { tokenName: "yellow700", cssVar: "var(--seed-color-palette-yellow-700)" },
    { tokenName: "yellow800", cssVar: "var(--seed-color-palette-yellow-800)" },
    { tokenName: "yellow900", cssVar: "var(--seed-color-palette-yellow-900)" },
    { tokenName: "yellow1000", cssVar: "var(--seed-color-palette-yellow-1000)" },
  ],
  purple: [
    { tokenName: "purple100", cssVar: "var(--seed-color-palette-purple-100)" },
    { tokenName: "purple200", cssVar: "var(--seed-color-palette-purple-200)" },
    { tokenName: "purple300", cssVar: "var(--seed-color-palette-purple-300)" },
    { tokenName: "purple400", cssVar: "var(--seed-color-palette-purple-400)" },
    { tokenName: "purple500", cssVar: "var(--seed-color-palette-purple-500)" },
    { tokenName: "purple600", cssVar: "var(--seed-color-palette-purple-600)" },
    { tokenName: "purple700", cssVar: "var(--seed-color-palette-purple-700)" },
    { tokenName: "purple800", cssVar: "var(--seed-color-palette-purple-800)" },
    { tokenName: "purple900", cssVar: "var(--seed-color-palette-purple-900)" },
    { tokenName: "purple1000", cssVar: "var(--seed-color-palette-purple-1000)" },
  ],
};

const FAMILY_ORDER = ["gray", "carrot", "blue", "red", "green", "yellow", "purple"];

export const PaletteColorPicker = () => {
  const { previewColor, setPreviewColor } = useIcon();

  return (
    <div className="flex flex-col gap-2">
      {FAMILY_ORDER.map((family) => (
        <div key={family} className="flex gap-1">
          {COLOR_FAMILIES[family].map((color) => {
            const isSelected = previewColor?.tokenName === color.tokenName;

            return (
              <button
                key={color.tokenName}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setPreviewColor(null);
                  } else {
                    setPreviewColor(color);
                  }
                }}
                className={clsx(
                  "w-5 h-5 rounded-sm border transition-transform hover:scale-125",
                  isSelected
                    ? "ring-2 ring-fd-primary ring-offset-1 scale-125"
                    : "border-fd-border",
                )}
                style={{ backgroundColor: color.cssVar }}
                aria-label={`palette.${color.tokenName}`}
                title={`palette.${color.tokenName}`}
              />
            );
          })}
        </div>
      ))}
      {previewColor && (
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-mono text-fd-muted-foreground">
            palette.{previewColor.tokenName}
          </span>
          <button
            type="button"
            onClick={() => setPreviewColor(null)}
            className="text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          >
            초기화
          </button>
        </div>
      )}
    </div>
  );
};
