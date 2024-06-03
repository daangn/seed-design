import { emit, on, showUI } from "@create-figma-plugin/utilities";
import {
  RequestComponentKeyHandler,
  RequestComponentPropertyDefinitionsHandler,
  RequestCssVariablesHandler,
  ResponseHandler,
} from "./types";
import { generateCssVars } from "./variable";

export default function () {
  on<RequestComponentPropertyDefinitionsHandler>(
    "REQUEST_COMPONENT_PROPERTY_DEFINITIONS",
    () => {
      const result = (figma.currentPage.selection[0] as ComponentSetNode)
        ?.componentPropertyDefinitions;

      if (!result) {
        return;
      }

      emit<ResponseHandler>("RESPONSE", JSON.stringify(result, null, 2));
    },
  );
  on<RequestComponentKeyHandler>("REQUEST_COMPONENT_KEY", () => {
    const result = (figma.currentPage.selection[0] as ComponentSetNode)?.key;

    if (!result) {
      return;
    }

    emit<ResponseHandler>("RESPONSE", result);
  });
  on<RequestCssVariablesHandler>("REQUEST_CSS_VARIABLES", () => {
    const result = generateCssVars();

    emit<ResponseHandler>("RESPONSE", result);
  });
  showUI({
    height: 640,
    width: 480,
  });
}
