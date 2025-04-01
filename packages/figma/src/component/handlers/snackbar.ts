import { camelCase } from "change-case";
import * as metadata from "../../data/__generated__/component-sets";
import { createElement } from "../../jsx";
import type { SnackbarProperties } from "../type";
import type { ComponentHandler } from "../type-helper";

export const snackbarHandler: ComponentHandler<SnackbarProperties> = {
  key: metadata.snackbar.key,
  codegen: async ({ componentProperties: props }) => {
    const commonProps = {
      message: props["Message#1528:4"].value,
      variant: camelCase(props.Variant.value),
      ...(props["Show Action Button#1528:0"].value && {
        actionLabel: props["Action Button Label#1528:8"].value,
      }),
    };

    // TODO: adapter.create({ render })
    return createElement("Snackbar", commonProps);
  },
};
