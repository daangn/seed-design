import dedent from "string-dedent";
import IconData from "@karrotmarket/karrot-ui-icon/lib/IconData.js";

import type { IconName } from "../types";

interface SpriteInterface {
  icons: IconName[];
  isGenerateAll: boolean;
}

export function generateSprite({ icons, isGenerateAll }: SpriteInterface) {
  if (isGenerateAll) {
    return dedent`
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    ${Object.entries(IconData)
      .map(([id, icon]) => {
        return icon
          .replace("<svg", `  <symbol id="${id}"`)
          .replace(/<path/g, "  <path")
          .replace("</svg>", "  </symbol>");
      })
      .join("")}</svg>\n
  `;
  }

  return dedent`
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    ${icons
      ?.map((id) => {
        const icon = IconData[id];
        return icon
          .replace("<svg", `  <symbol id="${id}"`)
          .replace(/<path/g, "  <path")
          .replace("</svg>", "  </symbol>");
      })
      .join("")}</svg>\n
  `;
}
