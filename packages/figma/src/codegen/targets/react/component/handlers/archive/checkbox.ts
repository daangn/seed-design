import type { CheckboxProperties } from "@/codegen/component-properties.archive";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { camelCase } from "change-case";
import { createLocalSnippetHelper } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";
import { handleSizeProp } from "../../size";
import { match } from "ts-pattern";

const { createLocalSnippetElement } = createLocalSnippetHelper("checkbox");

export const createCheckboxHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<CheckboxProperties>(
    metadata.checkbox.key,
    ({ componentProperties: props }) => {
      const tone = match(props.Tone.value)
        .with("Neutral", () => "neutral")
        .with("🚫[Deprecated]Brand", () => "brand")
        .exhaustive();

      const commonProps = {
        label: props["Label#49990:0"].value,
        weight: camelCase(props.Weight.value),
        tone,
        variant: camelCase(props.Shape.value),
        size: handleSizeProp(props.Size.value),
        ...(props.Selected.value === "True" && {
          defaultChecked: true,
        }),
        ...(props.Selected.value === "Indeterminate" && {
          defaultChecked: true,
          indeterminate: true,
        }),
        ...(props.State.value === "Disabled" && {
          disabled: true,
        }),
      };

      return createLocalSnippetElement("Checkbox", commonProps, undefined, {
        comment: "CheckboxGroup으로 묶어서 사용하는 것을 권장합니다.",
      });
    },
  );
