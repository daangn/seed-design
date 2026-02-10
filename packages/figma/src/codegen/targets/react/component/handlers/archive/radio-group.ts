import type { RadioProperties } from "@/codegen/component-properties.archive";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { createLocalSnippetHelper } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";
import { handleSizeProp } from "../../size";
import { camelCase } from "change-case";
import { match } from "ts-pattern";

const { createLocalSnippetElement } = createLocalSnippetHelper("radio-group");

export const createRadioGroupItemHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<RadioProperties>(metadata.radio.key, ({ componentProperties: props }) => {
    const tone = match(props.Tone.value)
      .with("Neutral", () => "neutral")
      .with("🚫[Deprecated]Brand", () => "brand")
      .exhaustive();

    const commonProps = {
      ...(props.State.value === "Disabled" && {
        disabled: true,
      }),
      label: props["Label#49990:171"].value,
      value: props["Label#49990:171"].value,
      size: handleSizeProp(props.Size.value),
      tone,
      weight: camelCase(props.Weight.value),
    };

    return createLocalSnippetElement("RadioGroupItem", commonProps);
  });
