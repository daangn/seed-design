import * as metadata from "../../data/__generated__/component-sets";
import { createIconTagNameFromKey } from "../../icon";
import { createElement } from "../../jsx";
import type { ComponentHandler } from "../type-helper";
import type { FabProperties } from "../type";

export const fabHandler: ComponentHandler<FabProperties> = {
  key: metadata.floatingActionButton.key,
  codegen: async ({ componentProperties: props }) => {
    return createElement(
      "Fab",
      undefined,
      createElement(createIconTagNameFromKey(props["Icon#28796:0"].componentKey)),
      "aria-label이나 aria-labelledby 중 하나를 제공해야 합니다.",
    );
  },
};
