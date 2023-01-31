import { Slice } from "gatsby";
import type { PropsWithChildren } from "react";

export function p({ children }: PropsWithChildren) {
  return <Slice alias="mdx/ParagraphSlice">{children}</Slice>;
}
