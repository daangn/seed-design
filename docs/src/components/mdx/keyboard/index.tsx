import { Slice } from "gatsby";
import type { PropsWithChildren } from "react";

export function Keyboard({ children }: PropsWithChildren) {
  return <Slice alias="mdx/KeyboardSlice">{children}</Slice>;
}
