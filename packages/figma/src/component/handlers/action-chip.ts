import { match } from "ts-pattern";
import * as metadata from "../../data/__generated__/component-sets";
import { createIconTagNameFromKey } from "../../icon";
import { createElement } from "../../jsx";
import { handleSize } from "../properties";
import type { ActionChipProperties } from "../type";
import type { ComponentHandler } from "../type-helper";

export const actionChipHandler: ComponentHandler<ActionChipProperties> = {
  key: metadata.actionChip.key,
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const { layout, children } = await match(props.Layout.value)
      .with("Icon Only", async () => ({
        layout: "iconOnly",
        children: [
          createElement("Icon", {
            svg: createElement(createIconTagNameFromKey(props["Icon#8714:0"].componentKey)),
          }),
        ],
      }))
      .with("Icon First", async () => ({
        layout: "withText",
        children: [
          createElement("PrefixIcon", {
            svg: createElement(createIconTagNameFromKey(props["Prefix Icon#8711:0"].componentKey)),
          }),
          props["Label#7185:0"].value,
        ],
      }))
      .with("Icon Last", async () => ({
        layout: "withText",
        children: [
          props["Label#7185:0"].value,
          createElement("SuffixIcon", {
            svg: createElement(createIconTagNameFromKey(props["Suffix Icon#8711:3"].componentKey)),
          }),
        ],
      }))
      .with("Icon Both", async () => ({
        layout: "withText",
        children: [
          createElement("PrefixIcon", {
            svg: createElement(createIconTagNameFromKey(props["Prefix Icon#8711:0"].componentKey)),
          }),
          props["Label#7185:0"].value,
          createElement("SuffixIcon", {
            svg: createElement(createIconTagNameFromKey(props["Suffix Icon#8711:3"].componentKey)),
          }),
        ],
      }))
      .with("Text Only", () => ({
        layout: "withText",
        children: props["Label#7185:0"].value,
      }))
      .exhaustive();

    const commonProps = {
      size: handleSize(props.Size.value),
      layout,
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
      ...(props["Show Count#7185:42"].value && {
        count: Number(props["Count#7185:21"].value),
      }),
    };
    return createElement("ActionChip", commonProps, children);
  },
};
