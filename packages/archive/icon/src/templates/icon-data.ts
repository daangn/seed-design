import dedent from "string-dedent";
import IconData from "@karrotmarket/karrot-ui-icon/lib/IconData.js";

import type { IconName } from "../types";

export function generateIconData({ icons }: { icons: IconName[] }) {
  return dedent`
    import * as React from "react";

    export const iconData: Record<string, React.ReactNode> = {
    ${icons
      .map((id) => {
        const icon = IconData[id];
        return icon
          .replace("<svg", `  "${id}": (\n    <svg id="${id}"`)
          .replace(">", ">\n      <g>")
          .replace(/<path/g, "        <path")
          .replace("</svg>", "      </g>\n    </svg>\n  ),")
          .replace(/clip-rule/g, "clipRule")
          .replace(/fill-rule/g, "fillRule")
          .replace(/width="24"/, `width="100%"`)
          .replace(/height="24"/, `height="100%"`);
      })
      .join("")}};\n
  `;
}
