import type IconData from "@karrotmarket/karrot-ui-icon/lib/IconData";

export type IconName = keyof typeof IconData;
export interface IconConfig {
  componentOutputPath: string;
  componentFileName: string;

  spriteOutputPath: string;
  spriteFileName: string;
  
  icons: IconName[];
}
