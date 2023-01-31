import { Slice } from "gatsby";
import type { PropsWithChildren } from "react";

interface Props {
  id?: string;
}

export function h1({ children, id }: PropsWithChildren<Props>) {
  return (
    <Slice alias="mdx/h1" id={id}>
      {children}
    </Slice>
  );
}
export function h2({ children, id }: PropsWithChildren<Props>) {
  return (
    <Slice alias="mdx/h2" id={id}>
      {children}
    </Slice>
  );
}
export function h3({ children, id }: PropsWithChildren<Props>) {
  return (
    <Slice alias="mdx/h3" id={id}>
      {children}
    </Slice>
  );
}
export function h4({ children, id }: PropsWithChildren<Props>) {
  return (
    <Slice alias="mdx/h4" id={id}>
      {children}
    </Slice>
  );
}
