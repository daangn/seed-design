"use client";

import { useIcon } from "./icon-context";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

function resolveColorToHex(cssVar: string): string {
  if (typeof document === "undefined") return "";
  const kebabVar = cssVar.replace("var(", "").replace(")", "").trim();
  const resolved = getComputedStyle(document.documentElement).getPropertyValue(kebabVar).trim();
  return resolved || "";
}

function applySvgColor(svgString: string, hexColor: string): string {
  if (!hexColor) return svgString;
  return svgString.replace(/fill="currentColor"/g, `fill="${hexColor}"`);
}

export const IconDetailSvgPreview = () => {
  const { selectedIcon, previewColor } = useIcon();

  if (!selectedIcon) return null;

  const resolvedHex = previewColor ? resolveColorToHex(previewColor.cssVar) : "";
  const displaySvg = resolvedHex ? applySvgColor(selectedIcon.svg, resolvedHex) : selectedIcon.svg;

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-xs font-semibold text-fd-muted-foreground uppercase tracking-wider">
        SVG
      </h4>
      <DynamicCodeBlock lang="xml" code={displaySvg} />
    </div>
  );
};
