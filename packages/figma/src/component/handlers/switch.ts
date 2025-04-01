import * as metadata from "../../data/__generated__/component-sets";
import { createElement } from "../../jsx";
import { handleSize } from "../properties";
import type { SwitchProperties } from "../type";
import type { ComponentHandler } from "../type-helper";

export const switchHandler: ComponentHandler<SwitchProperties> = {
  key: metadata.switch.key,
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const size = handleSize(props.Size.value);

    const commonProps = {
      size,
      ...(size === "small" && {
        label: props["Label#15191:2"].value,
      }),
      ...(states.includes("Selected") && {
        defaultChecked: true,
      }),
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
    };

    return createElement("Switch", commonProps);
  },
};
