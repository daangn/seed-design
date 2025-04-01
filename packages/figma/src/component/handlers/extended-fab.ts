import { camelCase } from "change-case";
import * as metadata from "../../data/__generated__/component-sets";
import { createIconTagNameFromKey } from "../../icon";
import { createElement } from "../../jsx";
import { handleSize } from "../properties";
import type { ExtendedFabProperties } from "../type";
import type { ComponentHandler } from "../type-helper";

export const extendedFabHandler: ComponentHandler<ExtendedFabProperties> = {
  key: metadata.extendedFloatingActionButton.key,
  codegen: async ({ componentProperties: props }) => {
    const commonProps = {
      size: handleSize(props.Size.value),
      variant: camelCase(props.Variant.value),
    };

    return createElement("ExtendedFab", commonProps, [
      createElement("PrefixIcon", {
        svg: createElement(createIconTagNameFromKey(props["Icon#28796:0"].componentKey)),
      }),
      props["Label#28936:0"].value,
    ]);
  },
};
