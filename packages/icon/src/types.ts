import type IconData from "@karrotmarket/karrot-ui-icon/lib/IconData";

export type IconName = keyof typeof IconData;
export interface IconConfig {
  contextPath: string;

  componentPath: string;

  spritePath: string;

  icons: IconName[];
}
