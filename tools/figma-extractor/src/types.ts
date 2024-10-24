import type { EventHandler } from "@create-figma-plugin/utilities";

export interface RequestComponentPropertyDefinitionsHandler extends EventHandler {
  name: "REQUEST_COMPONENT_PROPERTY_DEFINITIONS";
  handler: () => void;
}

export interface RequestComponentKeyHandler extends EventHandler {
  name: "REQUEST_COMPONENT_KEY";
  handler: () => void;
}

export interface RequestCssHandler extends EventHandler {
  name: "REQUEST_CSS";
  handler: () => void;
}

export interface ResponseHandler extends EventHandler {
  name: "RESPONSE";
  handler: (code: string) => void;
}

export interface RequestJsonSchemaHandler extends EventHandler {
  name: "REQUEST_JSON_SCHEMA";
  handler: () => void;
}

export interface RequestColorJsonHandler extends EventHandler {
  name: "REQUEST_COLOR_JSON";
  handler: (colorMode: "light" | "dark") => void;
}
