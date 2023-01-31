import { Slice } from "gatsby";
import type { PropsWithChildren } from "react";

export function ol({ children }: PropsWithChildren) {
  return <Slice alias="mdx/OrderedListSlice">{children}</Slice>;
}
export function oli({ children }: PropsWithChildren) {
  return <Slice alias="mdx/OrderedListItemSlice">{children}</Slice>;
}
