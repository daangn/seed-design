import { camelCase } from "change-case";
import * as metadata from "../../data/__generated__/component-sets";
import { createElement } from "../../jsx";
import { handleSize } from "../properties";
import type { CheckboxProperties } from "../type";
import type { ComponentHandler } from "../type-helper";

export const checkboxHandler: ComponentHandler<CheckboxProperties> = {
  key: metadata.checkbox.key,
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");

    const commonProps = {
      label: props["Label#49990:0"].value,
      weight: camelCase(props.Weight.value),
      variant: camelCase(props.Shape.value),
      size: handleSize(props.Size.value),
      ...(states.includes("Selected") && {
        defaultChecked: true,
      }),
      ...(states.includes("Indeterminate") && {
        defaultChecked: true,
        indeterminate: true,
      }),
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
    };

    return createElement("Checkbox", commonProps);
  },
};
