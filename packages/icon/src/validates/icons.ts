import IconData from "@karrotmarket/karrot-ui-icon/lib/IconData.js";
import kleur from "kleur";

import type { IconName } from "../types";

export const validateIcons = (icons: IconName[]) => {
  if (!icons) {
    console.log(
      kleur.red(
        "🚨 현재 config에 icons 필드가 선언되어 있지 않습니다. `icon.config.yml` 파일을 확인해주세요.",
      ),
    );
    console.log(
      kleur.red(
        "🚨 There is no icons field declared in the current config. Please check the file `icon.config.yml`.",
      ),
    );
    console.log();

    process.exit(1);
  }

  for (const icon of icons) {
    const iconName = icon as IconName;
    if (!IconData[iconName]) {
      console.log(
        kleur.red(
          `🚨 ${icon} 아이콘이 존재하지 않습니다. 존재하는 아이콘만 입력해주세요.`,
        ),
      );
      console.log(
        kleur.red(
          `🚨 ${icon} icon does not exist. Please enter only existing icons.`,
        ),
      );
      console.log();

      process.exit(1);
    }
  }
};
