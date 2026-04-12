import type { BaseComponentProps } from "@json-render/react";
import { Callout as SnippetCallout } from "~/registry/ui/callout";

export const Callout = ({ props }: BaseComponentProps) => <SnippetCallout {...(props as any)} />;
