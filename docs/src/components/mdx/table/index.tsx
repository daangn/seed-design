import { Slice } from "gatsby";
import type { PropsWithChildren } from "react";

export function Table({ children }: PropsWithChildren) {
  return <Slice alias="mdx/TableSlice">{children}</Slice>;
}
export function TableData({ children }: PropsWithChildren) {
  return <Slice alias="mdx/TableDataSlice">{children}</Slice>;
}
export function TableHead({ children }: PropsWithChildren) {
  return <Slice alias="mdx/TableHeadSlice">{children}</Slice>;
}
export function TableRow({ children }: PropsWithChildren) {
  return <Slice alias="mdx/TableRowSlice">{children}</Slice>;
}
export function TableBody({ children }: PropsWithChildren) {
  return <Slice alias="mdx/TableBodySlice">{children}</Slice>;
}
