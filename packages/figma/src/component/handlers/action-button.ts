import { camelCase } from "change-case";
import { match } from "ts-pattern";
import * as metadata from "../../data/__generated__/component-sets";
import { createIconTagNameFromKey } from "../../icon";
import { createElement } from "../../jsx";
import { handleSize } from "../properties";
import type { ActionButtonProperties } from "../type";
import type { ComponentHandler } from "../type-helper";

export const actionButtonHandler: ComponentHandler<ActionButtonProperties> = {
  key: metadata.actionButton.key,
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const { layout, children } = await match(props.Layout.value)
      .with("Icon Only", async () => ({
        layout: "iconOnly",
        children: [
          createElement("Icon", {
            svg: createElement(createIconTagNameFromKey(props["Icon#7574:0"].componentKey)),
          }),
        ],
      }))
      .with("Icon First", async () => ({
        layout: "withText",
        children: [
          createElement("PrefixIcon", {
            svg: createElement(
              createIconTagNameFromKey(props["Prefix Icon#5987:305"].componentKey),
            ),
          }),
          props["Label#5987:61"].value,
        ],
      }))
      .with("Icon Last", async () => ({
        layout: "withText",
        children: [
          props["Label#5987:61"].value,
          createElement("SuffixIcon", {
            svg: createElement(
              createIconTagNameFromKey(props["Suffix Icon#5987:244"].componentKey),
            ),
          }),
        ],
      }))
      .with("Text Only", () => ({
        layout: "withText",
        children: props["Label#5987:61"].value,
      }))
      .exhaustive();

    const commonProps = {
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
      ...(states.includes("Loading") && {
        loading: true,
      }),
      size: handleSize(props.Size.value),
      variant: camelCase(props.Variant.value),
      layout,
    };

    return createElement("ActionButton", commonProps, children);
  },
};
