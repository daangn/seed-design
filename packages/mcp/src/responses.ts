import { formatError } from "./logger";

/**
 * Helper type for a tool response content item
 */
export type ContentItem =
  | { type: "text"; text: string }
  | { type: "image"; data: string; mimeType: string };

/**
 * Helper type for a tool response
 */
export type ToolResponse = {
  content: ContentItem[];
};

/**
 * Format an object response
 */
export function formatObjectResponse(result: unknown): ToolResponse {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result),
      },
    ],
  };
}

/**
 * Format a text response
 */
export function formatTextResponse(text: string): ToolResponse {
  return {
    content: [
      {
        type: "text",
        text,
      },
    ],
  };
}

/**
 * Format an image response
 */
export function formatImageResponse(imageData: string, mimeType = "image/png"): ToolResponse {
  return {
    content: [
      {
        type: "image",
        data: imageData,
        mimeType,
      },
    ],
  };
}

/**
 * Format an error response
 */
export function formatErrorResponse(toolName: string, error: unknown): ToolResponse {
  return {
    content: [
      {
        type: "text",
        text: `Error in ${toolName}: ${formatError(error)}`,
      },
    ],
  };
}

/**
 * Format a progress response with initial message
 */
export function formatProgressResponse(initialMessage: string, result: unknown): ToolResponse {
  return {
    content: [
      {
        type: "text",
        text: initialMessage,
      },
      {
        type: "text",
        text: typeof result === "string" ? result : JSON.stringify(result),
      },
    ],
  };
}
