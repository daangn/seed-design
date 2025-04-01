import * as metadata from "../../data/__generated__/component-sets";
import { createIconTagNameFromKey } from "../../icon";
import { createElement } from "../../jsx";
import { handleSize } from "../properties";
import type { ReactionButtonProperties } from "../type";
import type { ComponentHandler } from "../type-helper";

export const reactionButtonHandler: ComponentHandler<ReactionButtonProperties> = {
  key: metadata.reactionButton.key,
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const commonProps = {
      size: handleSize(props.Size.value),
      ...(states.includes("Loading") && {
        loading: true,
      }),
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
      ...(states.includes("Selected") && {
        defaultPressed: true,
      }),
    };

    return createElement("ReactionButton", commonProps, [
      createElement("PrefixIcon", {
        svg: createElement(createIconTagNameFromKey(props["Icon#12379:0"].componentKey)),
      }),
      props["Label#6397:0"].value,
      props["Show Count#6397:33"].value
        ? createElement("Count", {}, props["Count#15816:0"].value)
        : undefined,
    ]);
  },
};
