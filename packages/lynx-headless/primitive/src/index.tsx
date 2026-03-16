import { forwardRef } from "react";
import { Slot } from "./Slot";

export interface PrimitiveProps {
  /**
   * Whether the element should be rendered as a child of a slot.
   * @default false
   */
  asChild?: boolean;
}

function createPrimitive(node: string) {
  const Node = forwardRef<unknown, PrimitiveProps & Record<string, unknown>>((props, ref) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : (node as unknown as React.ElementType);

    return <Comp {...primitiveProps} ref={ref} />;
  });

  Node.displayName = `Primitive.${node}`;

  return Node;
}

export const Primitive = {
  view: createPrimitive("view"),
  text: createPrimitive("text"),
  image: createPrimitive("image"),
  input: createPrimitive("input"),
  textarea: createPrimitive("textarea"),
  scrollView: createPrimitive("scroll-view"),
} as const;

export { Slot, type SlotProps } from "./Slot";
export { composeRefs } from "./composeRefs";
