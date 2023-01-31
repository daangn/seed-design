import { Slice } from "gatsby";
import type { PropsWithChildren } from "react";

export function DoBox({ children }: PropsWithChildren) {
  return <Slice alias="mdx/DoBoxSlice">{children}</Slice>;
}
export function DoText({ children }: PropsWithChildren) {
  return <Slice alias="mdx/DoTextSlice">{children}</Slice>;
}
export function DoImage({ children }: PropsWithChildren) {
  return <Slice alias="mdx/DoImageSlice">{children}</Slice>;
}

export function DontBox({ children }: PropsWithChildren) {
  return <Slice alias="mdx/DontBoxSlice">{children}</Slice>;
}
export function DontText({ children }: PropsWithChildren) {
  return <Slice alias="mdx/DontTextSlice">{children}</Slice>;
}
export function DontImage({ children }: PropsWithChildren) {
  return <Slice alias="mdx/DontImageSlice">{children}</Slice>;
}

export function DoDontLayout({ children }: PropsWithChildren) {
  return <Slice alias="mdx/DoDontLayoutSlice">{children}</Slice>;
}
