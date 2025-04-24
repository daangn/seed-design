import { createElement, defineComponentTransformer } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { camelCase } from "change-case";
import type { SeedComponentTransformerDeps } from "../deps.interface";
import type { SnackbarProperties } from "@/codegen/component-properties";

export const createSnackbarTransformer = (_ctx: SeedComponentTransformerDeps) =>
  defineComponentTransformer<SnackbarProperties>(
    metadata.snackbar.key,
    ({ componentProperties: props }) => {
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
  );
