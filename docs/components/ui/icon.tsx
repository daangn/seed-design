import type { LucideIcon } from "lucide-react";
import type { ReactElement } from "react";

export function IconContainer({ icon: Icon }: { icon: LucideIcon }): ReactElement {
  return <Icon />;
}
