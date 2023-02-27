import dedent from "string-dedent";
import IconData from "@karrotmarket/karrot-ui-icon/lib/IconData.js";

import type { IconName } from "../types";

// <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">

export function generateSprite({ icons }: { icons: IconName[] }) {
  return dedent`
    <svg hidden aria-hidden="true" display="none" id="seed-icon-injected-svg">
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
