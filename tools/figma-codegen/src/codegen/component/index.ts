import { camelCase } from "change-case";
import type { ElementNode } from "../jsx";
import { createElement } from "../jsx";
import { BoxButtonProperties } from "./type";
import { createIconTagNameFromId, createIconTagNameFromKey } from "../icon";

export interface ComponentHandler<
  T extends InstanceNode["componentProperties"] = InstanceNode["componentProperties"],
> {
  key: string;
  name: string;
  codegen: (node: InstanceNode & { componentProperties: T }) => ElementNode;
}

const boxButtonHandler: ComponentHandler<BoxButtonProperties> = {
  key: "21ca4a592a75b9dae5b964421c065c1beb37416e",
  name: "BoxButton",
  codegen: ({ componentProperties: props }) => {
    const commonProps = {
      size: props.Size.value.toString().toLowerCase(),
      variant: camelCase(props.Variant.value.toString(), {
        mergeAmbiguousCharacters: true,
      }),
      prefixIcon: props["Prefix Icon#366:0"].value
        ? createElement(createIconTagNameFromId(props["↳Icons#449:9"].value))
        : undefined,
    };
    return createElement(
      "BoxButton",
      commonProps,
      props["Label#369:5"].value as string,
    );
  },
};

const componentHandlers = [boxButtonHandler] as ComponentHandler[];

export const componentHandlerMap = new Map(
  componentHandlers.map((component) => [component.key, component]),
);

export const ignoredComponentKeys = new Set<string>([
  "a96fe9696d66425daa57bdc86a378a54a54ae0f9",
  "5f5b68664abeaacde7d38c2418cc8e9706bf20d8",
]);
