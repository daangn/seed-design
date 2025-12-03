import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { formatError } from "./logger";

/**
 * Format an object response
 */
export function formatObjectResponse(result: unknown): CallToolResult {
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
export function formatTextResponse(text: string): CallToolResult {
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
export function formatImageResponse(imageData: string, mimeType = "image/png"): CallToolResult {
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
export function formatErrorResponse(toolName: string, error: unknown): CallToolResult {
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
export function formatProgressResponse(initialMessage: string, result: unknown): CallToolResult {
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
