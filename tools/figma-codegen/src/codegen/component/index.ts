import { camelCase } from "change-case";
import { match } from "ts-pattern";
import { createIconTagNameFromId, createIconTagNameFromKey } from "../icon";
import type { ElementNode } from "../jsx";
import { createElement } from "../jsx";
import type { BoxButtonProperties, CalloutProperties, ChipProperties } from "./type";

export interface ComponentHandler<
  T extends InstanceNode["componentProperties"] = InstanceNode["componentProperties"],
> {
  key: string;
  codegen: (node: InstanceNode & { componentProperties: T }) => ElementNode;
}

const boxButtonHandler: ComponentHandler<BoxButtonProperties> = {
  key: "21ca4a592a75b9dae5b964421c065c1beb37416e",
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
    return createElement("BoxButton", commonProps, props["Label#369:5"].value);
  },
};

const chipHandler: ComponentHandler<ChipProperties> = {
  key: "a586288593c6dccf4932ebc684cbb2f91851ed4c",
  codegen: ({ componentProperties: props }) => {
    const commonProps = {
      size: props.Size.value.toString().toLowerCase(),
      variant: match(props.동작.value)
        .with("Button", () => (props.Inverted.value === "True" ? "inverted" : "default"))
        .with("Toggle", () => undefined)
        .with("Radio", () => undefined)
        .exhaustive(),
      prefixIcon: props["Prefix#28752:25"].value
        ? createElement(createIconTagNameFromId(props["↳Icon#52835:0"].value))
        : undefined,
      suffixIcon: props["Suffix#28752:0"].value
        ? createElement(createIconTagNameFromId(props["↳Icon #52835:5"].value))
        : undefined,
    };
    return createElement("ChipButton", commonProps, props["Label#28900:0"].value);
  },
};

const calloutHandler: ComponentHandler<CalloutProperties> = {
  key: "edc3d56308d32b0a52428d800c7989b04c4dbe8b",
  codegen: ({ componentProperties: props, children }) => {
    const textNode = children.find((child) => child.type === "TEXT") as TextNode;
    const slices = textNode.getStyledTextSegments(["fontWeight", "textDecoration"]);
    const { title, description, link } = match(props.Layout.value)
      .with("Description Only", () => ({
        title: undefined,
        description: slices[0]?.characters.trim(),
        link: undefined,
      }))
      .with("Title + Description", () => ({
        title: slices[0]?.characters.trim(),
        description: slices[1]?.characters.trim(),
        link: undefined,
      }))
      .with("Title + Description + Link", () => ({
        title: slices[0]?.characters.trim(),
        description: slices[1]?.characters.trim(),
        link: slices[2]?.characters.trim(),
      }))
      .exhaustive();

    const commonProps = {
      variant: camelCase(props.Variant.value),
      title,
      description,
      link,
      icon: props["Icon#70258:5"].value
        ? createElement(createIconTagNameFromKey("36b3f37b9ff41c2c39ec14c58aefdf273a22544e"))
        : undefined,
    };

    return createElement("Callout", commonProps);
  },
};

const componentHandlers = [boxButtonHandler, chipHandler, calloutHandler] as ComponentHandler[];

export const componentHandlerMap = new Map(
  componentHandlers.map((component) => [component.key, component]),
);

export const ignoredComponentKeys = new Set<string>([
  "a96fe9696d66425daa57bdc86a378a54a54ae0f9",
  "5f5b68664abeaacde7d38c2418cc8e9706bf20d8",
]);
