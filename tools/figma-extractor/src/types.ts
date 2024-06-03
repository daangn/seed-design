import { EventHandler } from "@create-figma-plugin/utilities";

export interface RequestComponentPropertyDefinitionsHandler
  extends EventHandler {
  name: "REQUEST_COMPONENT_PROPERTY_DEFINITIONS";
  handler: () => void;
}

export interface RequestComponentKeyHandler extends EventHandler {
  name: "REQUEST_COMPONENT_KEY";
  handler: () => void;
}

export interface RequestCssVariablesHandler extends EventHandler {
  name: "REQUEST_CSS_VARIABLES";
  handler: () => void;
}

export interface ResponseHandler extends EventHandler {
  name: "RESPONSE";
  handler: (code: string) => void;
}
