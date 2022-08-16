import { PolymorphicProps, PolymorphicRef } from "@seed-design/react-utils";
import React, { ElementType, ReactElement } from "react";

type HeadingProps<E extends ElementType = "span"> = PolymorphicProps<E> & {
  type: "h1" | "h2" | "h3" | "h4";
};

function Heading<E extends ElementType = "span">(
  props: HeadingProps<E>,
  ref: PolymorphicRef<E>
) {
  const Element = props.as ?? "span";

  return (
    <Element ref={ref} className={`seed-typography-${props.type}`}>
      {props.children}
    </Element>
  );
}

let _Heading = React.forwardRef(Heading) as <E extends ElementType = "span">(
  props: HeadingProps<E>
) => ReactElement;
export { _Heading as Heading };
