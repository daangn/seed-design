import { createElement, defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import type { NormalizedTextNode } from "@/normalizer";
import { camelCase } from "change-case";
import type { SeedComponentHandlerDeps } from "../deps.interface";
import type { CalloutProperties } from "@/codegen/component-properties";

export const createCalloutHandler = (ctx: SeedComponentHandlerDeps) =>
  defineComponentHandler<CalloutProperties>(
    metadata.callout.key,
    ({ componentProperties: props, children }) => {
      const tag = (() => {
        switch (props.Interaction.value) {
          case "Default":
            return "Callout";
          case "Actionable":
            return "ActionableCallout";
          case "Dismissible":
            return "DismissibleCallout";
          default:
            return "Callout";
        }
      })();

      const textNode = children.find((child) => child.type === "TEXT") as NormalizedTextNode | null;

      if (!textNode) {
        return createElement(tag, undefined, undefined, "내용을 제공해주세요.");
      }

      const slices = textNode.segments;

      let title: string | undefined;
      let description: string | undefined;
      let linkLabel: string | undefined;

      switch (slices.length) {
        case 1: {
          description = slices[0]?.characters.trim();

          break;
        }
        case 2: {
          const firstSlice = slices[0];
          const secondSlice = slices[1];

          if (firstSlice?.style.fontWeight === 700) {
            title = firstSlice?.characters.trim();
            description = secondSlice?.characters.trim();
            break;
          }

          description = firstSlice?.characters.trim();

          if (tag !== "ActionableCallout") {
            linkLabel = secondSlice?.characters.trim();
          }

          break;
        }
        case 3: {
          title = slices[0]?.characters.trim();
          description = slices[1]?.characters.trim();

          if (tag !== "ActionableCallout") {
            linkLabel = slices[2]?.characters.trim();
          }

          break;
        }
      }

      const commonProps = {
        tone: camelCase(props.Tone.value),
        title,
        description,
        linkProps: {
          children: linkLabel,
        },
        ...(props["Icon#12598:210"].value && {
          prefixIcon: createElement(
            ctx.iconService.createIconTagName(props["Icon#12598:210"].componentKey),
          ),
        }),
      };

      return createElement(tag, commonProps);
    },
  );
