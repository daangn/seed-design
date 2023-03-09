import dedent from "string-dedent";
import IconData from "@karrotmarket/karrot-ui-icon/lib/IconData.js";

import type { IconName } from "../types";

export function generateSprite({ icons }: { icons: IconName[] }) {
  return dedent`
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    ${icons
      ?.map((id) => {
        const icon = IconData[id];
        return icon
          .replace("<svg", `  <symbol id="${id}"`)
          .replace(">", ">\n    <g>")
          .replace(/<path/g, "      <path")
          .replace("</svg>", "    </g>\n  </symbol>");
      })
      .join("")}</svg>\n
  `;
}
