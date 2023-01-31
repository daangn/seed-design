import { Slice } from "gatsby";
import type { PropsWithChildren } from "react";

export function FullCard({ children }: PropsWithChildren) {
  return <Slice alias="mdx/FullCardSlice">{children}</Slice>;
}
export function FullCardImageCell({ children }: PropsWithChildren) {
  return <Slice alias="mdx/FullCardImageCellSlice">{children}</Slice>;
}
export function FullCardDescription({ children }: PropsWithChildren) {
  return <Slice alias="mdx/FullCardDescriptionSlice">{children}</Slice>;
}

export function HalfCard({ children }: PropsWithChildren) {
  return <Slice alias="mdx/HalfCardSlice">{children}</Slice>;
}
export function HalfCardImageCell({ children }: PropsWithChildren) {
  return <Slice alias="mdx/HalfCardImageCellSlice">{children}</Slice>;
}
export function HalfCardDescriptionCell({ children }: PropsWithChildren) {
  return <Slice alias="mdx/HalfCardDescriptionCellSlice">{children}</Slice>;
}
export function HalfCardDescriptionTitle({ children }: PropsWithChildren) {
  return <Slice alias="mdx/HalfCardDescriptionTitleSlice">{children}</Slice>;
}
export function HalfCardDescription({ children }: PropsWithChildren) {
  return <Slice alias="mdx/HalfCardDescriptionSlice">{children}</Slice>;
}
