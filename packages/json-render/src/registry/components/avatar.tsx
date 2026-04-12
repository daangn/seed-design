import type { BaseComponentProps } from "@json-render/react";
import { Avatar as SnippetAvatar } from "~/registry/ui/avatar";

export const Avatar = ({ props }: BaseComponentProps) => <SnippetAvatar {...(props as any)} />;
