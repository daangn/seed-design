import type { SnackbarProperties } from "@/codegen/component-properties.archive";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { camelCase } from "change-case";
import { createLocalSnippetHelper } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";

const { createLocalSnippetElement } = createLocalSnippetHelper("snackbar");

export const createSnackbarHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<SnackbarProperties>(
    metadata.snackbar.key,
    ({ componentProperties: props }) => {
      const commonProps = {
        message: props["Message#1528:4"].value,
        variant: camelCase(props.Variant.value),
        ...(props["Show Action#1528:0"].value && {
          actionLabel: props["Action Label#1528:8"].value,
        }),
      };

      // TODO: adapter.create({ render })
      return createLocalSnippetElement("Snackbar", commonProps);
    },
  );
