import { camelCase } from "change-case";
import { match } from "ts-pattern";
import * as metadata from "../../data/__generated__/component-sets";
import { createIconTagNameFromKey } from "../../icon";
import { createElement } from "../../jsx";
import { findOne } from "../../utils/figma-node";
import type { NormalizedInstanceNode } from "../../normalizer/types";
import { handleSize } from "../properties";
import type { TextButtonProperties } from "../type";
import type { ComponentHandler } from "../type-helper";

export const textButtonHandler: ComponentHandler<TextButtonProperties> = {
  key: metadata.textButton.key,
  codegen: async (node) => {
    const { componentProperties: props } = node;

    const states = props.State.value.split("-");

    const { prefixIcon, suffixIcon, children } = await match(props.Layout.value)
      .with("Icon First", async () => ({
        prefixIcon: createElement(
          createIconTagNameFromKey(props["Prefix Icon#7561:0"].componentKey),
        ),
        suffixIcon: undefined,
        children: props["Label#6148:0"].value,
      }))
      .with("Icon Last", () => {
        const suffixIconNode = findOne(
          node,
          (node) => node.type === "INSTANCE" && node.name === "Suffix Icon",
        ) as NormalizedInstanceNode | null;

        const suffixIconComponentKey = suffixIconNode?.componentKey;

        return {
          prefixIcon: undefined,
          suffixIcon: suffixIconComponentKey
            ? createElement(createIconTagNameFromKey(suffixIconComponentKey))
            : undefined,
          children: props["Label#6148:0"].value,
        };
      })
      .exhaustive();

    const commonProps = {
      tone: camelCase(props.Tone.value),
      size: handleSize(props.Size.value),
      prefixIcon,
      suffixIcon,
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
    };

    return createElement("TextButton", commonProps, children);
  },
};
