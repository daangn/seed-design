import { Slice } from "gatsby";
import type { PropsWithChildren } from "react";

export function Iframe({ children }: PropsWithChildren) {
  return <Slice alias="mdx/IframeSlice">{children}</Slice>;
}
