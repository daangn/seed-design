import type IconData from "@karrotmarket/karrot-ui-icon/lib/IconData";

export type IconName = keyof typeof IconData;
export interface IconConfig {
  icons: IconName[];

  componentPath: string;

  spritePath: string;

  contextPath?: string;
}
