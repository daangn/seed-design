import { Text } from "@seed-design/react-text";
import { PolymorphicProps, PolymorphicRef } from "@seed-design/react-utils";
import React, { ElementType, ReactElement } from "react";
import "./button.css";

type ButtonProps<E extends ElementType = "button"> = PolymorphicProps<E> & {
  size: "large" | "medium" | "small" | "xsmall";
  color: "primary" | "primaryLow" | "secondary";
};

function Button<E extends ElementType = "button">(
  props: ButtonProps<E>,
  ref: PolymorphicRef<E>
) {
  const Element = props.as ?? "button";

  return (
    <Element
      ref={ref}
      className={`seed-button seed-button-size-${props.size} seed-button-color-${props.color}`}
    >
      {typeof props.children === "string" ? (
        <Text type="label3" weight="bold">
          {props.children}
        </Text>
      ) : (
        props.children
      )}
    </Element>
  );
}

let _Button = React.forwardRef(Button) as <E extends ElementType = "button">(
  props: ButtonProps<E>
) => ReactElement;
export { _Button as Button };
