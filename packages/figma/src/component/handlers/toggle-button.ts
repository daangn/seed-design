import { camelCase } from "change-case";
import * as metadata from "../../data/__generated__/component-sets";
import { createIconTagNameFromKey } from "../../icon";
import { createElement } from "../../jsx";
import { handleSize } from "../properties";
import type { ToggleButtonProperties } from "../type";
import type { ComponentHandler } from "../type-helper";

export const toggleButtonHandler: ComponentHandler<ToggleButtonProperties> = {
  key: metadata.toggleButton.key,
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const commonProps = {
      variant: camelCase(props.Variant.value),
      size: handleSize(props.Size.value),
      ...(states.includes("Selected") && {
        defaultPressed: true,
      }),
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
      ...(states.includes("Loading") && {
        loading: true,
      }),
    };

    return createElement("ToggleButton", commonProps, [
      props["Show Prefix Icon#6122:392"].value
        ? createElement("PrefixIcon", {
            svg: createElement(createIconTagNameFromKey(props["Prefix Icon#6122:98"].componentKey)),
          })
        : undefined,
      props["Label#6122:49"].value,
      props["Show Suffix Icon#6122:147"].value
        ? createElement("SuffixIcon", {
            svg: createElement(
              createIconTagNameFromKey(props["Suffix Icon#6122:343"].componentKey),
            ),
          })
        : undefined,
    ]);
  },
};
