import type { BaseComponentProps } from "@json-render/react";
import { Switch as SnippetSwitch } from "~/registry/ui/switch";

export const Switch = ({ props }: BaseComponentProps) => <SnippetSwitch {...(props as any)} />;
