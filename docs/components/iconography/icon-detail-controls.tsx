"use client";

import clsx from "clsx";
import { useIcon } from "./icon-context";
import { PaletteColorPicker } from "./palette-color-picker";

const SIZE_PRESETS = [16, 20, 24, 32, 40, 48];

export const IconDetailControls = () => {
  const { iconStyle, previewSize, setPreviewSize } = useIcon();

  if (iconStyle !== "monochrome") return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-semibold text-fd-muted-foreground uppercase tracking-wider">
          Color
        </h4>
        <PaletteColorPicker />
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-semibold text-fd-muted-foreground uppercase tracking-wider">
          Size
        </h4>
        <div className="flex gap-1.5 flex-wrap">
          {SIZE_PRESETS.map((size) => {
            const isSelected = previewSize === size;

            return (
              <button
                key={size}
                type="button"
                onClick={() => setPreviewSize(size)}
                className={clsx(
                  "px-2.5 py-1 text-xs rounded-md border transition-colors",
                  isSelected
                    ? "bg-fd-primary text-fd-primary-foreground border-fd-primary"
                    : "bg-fd-background border-fd-border hover:bg-fd-muted",
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
