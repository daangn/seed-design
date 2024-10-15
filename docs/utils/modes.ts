/* eslint-disable import/no-relative-packages -- required */
import { PaletteIcon, AtomIcon, type LucideIcon } from "lucide-react";

export interface Mode {
  param: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export const modes: Mode[] = [
  {
    param: "design",
    name: "Design",
    description: "SEED 디자인 문서",
    icon: PaletteIcon,
  },
  {
    param: "react",
    name: "React",
    description: "SEED React 문서",
    icon: AtomIcon,
  },
];
