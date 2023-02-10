import IconData from "@karrotmarket/karrot-ui-icon/lib/IconData.js";

import type { IconName } from "../types";

export const validateIcons = (icons: IconName[]) => {
  if (!icons) {
    throw new Error("icons is not defined in icon.config.yml");
  }

  for (const icon of icons) {
    const iconName = icon as IconName;
    if (!IconData[iconName]) {
      throw new Error(`icon ${icon} is not exist`);
    }
  }
}
