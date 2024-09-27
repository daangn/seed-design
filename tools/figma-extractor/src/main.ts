import { emit, on, showUI } from "@create-figma-plugin/utilities";
import type {
  RequestComponentKeyHandler,
  RequestComponentPropertyDefinitionsHandler,
  RequestCssHandler,
  ResponseHandler,
} from "./types";
import { generateCss } from "./variable";

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
  showUI({
    height: 640,
    width: 480,
  });
}
