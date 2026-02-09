import type { ToggleButtonProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { camelCase } from "change-case";
import { createLocalSnippetHelper, createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { handleSizeProp } from "../size";

const { createLocalSnippetElement } = createLocalSnippetHelper("toggle-button");

export const createToggleButtonHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<ToggleButtonProperties>(
    metadata.componentToggleButton.key,
    ({ componentProperties: props }) => {
      const commonProps = {
        variant: camelCase(props.Variant.value),
        size: handleSizeProp(props.Size.value),
        ...(props.Selected.value === "True" && {
          defaultPressed: true,
        }),
        ...(props.State.value === "Disabled" && {
          disabled: true,
        }),
        ...(props.State.value === "Loading" && {
          loading: true,
        }),
      };

      return createLocalSnippetElement("ToggleButton", commonProps, [
        props["Show Prefix Icon#6122:392"].value
          ? createSeedReactElement("PrefixIcon", {
              svg: ctx.iconHandler.transform(props["Prefix Icon#6122:98"]),
            })
          : undefined,
        props["Label#6122:49"].value,
        props["Show Suffix Icon#6122:147"].value
          ? createSeedReactElement("SuffixIcon", {
              svg: ctx.iconHandler.transform(props["Suffix Icon#6122:343"]),
            })
          : undefined,
      ]);
    },
  );
