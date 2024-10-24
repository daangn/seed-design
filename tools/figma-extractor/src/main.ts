import { emit, on, showUI } from "@create-figma-plugin/utilities";
import type {
  RequestColorJsonHandler,
  RequestComponentKeyHandler,
  RequestComponentPropertyDefinitionsHandler,
  RequestCssHandler,
  RequestJsonSchemaHandler,
  ResponseHandler,
} from "./types";
import { generateColorJson, generateCss, generateJsonSchema } from "./variable";

export default function () {
  on<RequestComponentPropertyDefinitionsHandler>("REQUEST_COMPONENT_PROPERTY_DEFINITIONS", () => {
    const result = (figma.currentPage.selection[0] as ComponentSetNode)
      ?.componentPropertyDefinitions;

    if (!result) {
      return;
    }

    emit<ResponseHandler>("RESPONSE", JSON.stringify(result, null, 2));
  });

  on<RequestComponentKeyHandler>("REQUEST_COMPONENT_KEY", () => {
    const result = (figma.currentPage.selection[0] as ComponentSetNode)?.key;

    if (!result) {
      return;
    }

    emit<ResponseHandler>("RESPONSE", result);
  });

  on<RequestCssHandler>("REQUEST_CSS", () => {
    const result = generateCss();

    emit<ResponseHandler>("RESPONSE", result);
  });

  on<RequestJsonSchemaHandler>("REQUEST_JSON_SCHEMA", () => {
    const result = generateJsonSchema();

    emit<ResponseHandler>("RESPONSE", result);
  });

  on<RequestColorJsonHandler>("REQUEST_COLOR_JSON", (colorMode) => {
    const result = generateColorJson(colorMode);

    emit<ResponseHandler>("RESPONSE", result);
  });

  showUI({
    height: 640,
    width: 480,
  });
}
