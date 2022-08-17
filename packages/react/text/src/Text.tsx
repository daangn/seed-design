import { PolymorphicProps, PolymorphicRef } from "@seed-design/react-shared";
import { paramCase } from "change-case";
import { clsx } from "clsx";
import React, { ElementType, ReactElement } from "react";

type TextProps<E extends ElementType = "span"> = PolymorphicProps<E> & {
  type:
    | "bodyL1"
    | "bodyL2"
    | "bodyM1"
    | "bodyM2"
    | "label1"
    | "label2"
    | "label3"
    | "label4"
    | "label5"
    | "label6";
  weight: "regular" | "bold";
};

function Text<E extends ElementType = "span">(
  props: TextProps<E>,
  ref: PolymorphicRef<E>
) {
  const Element = props.as ?? "span";

  return (
    <Element
      ref={ref}
      className={clsx(
        `seed-typography-${paramCase(props.type)}-${props.weight}`,
        props.className
      )}
    >
      {props.children}
    </Element>
  );
}

let _Text = React.forwardRef(Text) as <E extends ElementType = "span">(
  props: TextProps<E>
) => ReactElement;
export { _Text as Text };
