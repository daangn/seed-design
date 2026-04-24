import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

type PrimitivePropsWithRef<E extends React.ElementType> = React.ComponentPropsWithRef<E> &
  PrimitiveProps;

function createPrimitive<E extends React.ElementType>(node: E) {
  const Node = React.forwardRef((props: PrimitivePropsWithRef<React.ElementType>, ref) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;

    return <Comp {...primitiveProps} ref={ref} />;
  });

  Node.displayName = `Primitive.${node}`;

  return Node as React.ForwardRefExoticComponent<PrimitivePropsWithRef<E>>;
}

export interface PrimitiveProps {
  /**
   * Whether the element should be rendered as a child of a slot.
   * @default false
   */
  asChild?: boolean;
}

export const Primitive = {
  div: createPrimitive("div"),
  span: createPrimitive("span"),
  img: createPrimitive("img"),
  button: createPrimitive("button"),
  label: createPrimitive("label"),
  input: createPrimitive("input"),
  textarea: createPrimitive("textarea"),
  a: createPrimitive("a"),
  p: createPrimitive("p"),
  h2: createPrimitive("h2"),
  ul: createPrimitive("ul"),
  li: createPrimitive("li"),
  svg: createPrimitive("svg"),
  circle: createPrimitive("circle"),
};
