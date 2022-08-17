import { Text } from "@seed-design/react-text";
import { PolymorphicProps, PolymorphicRef } from "@seed-design/react-shared";
import { paramCase } from "change-case";
import React, { ElementType, ReactElement } from "react";
import { clsx } from "clsx";
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
      className={clsx(
        "seed-button",
        `seed-button-size-${props.size}`,
        `seed-button-color-${paramCase(props.color)}`,
        props.className
      )}
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
