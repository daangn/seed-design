import type { CallToolResult } from "@modelcontextprotocol/server";
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
 *
 * `isError` is what lets a client tell a failed call from a successful one — without it the
 * message reads as ordinary output and the model has to notice the "Error in" prefix itself.
 */
export function formatErrorResponse(
  toolName: string,
  error: unknown,
  hint?: string,
): CallToolResult {
  return {
    content: [
      {
        type: "text",
        text: `Error in ${toolName}: ${formatError(error)}${hint ? `\n\n${hint}` : ""}`,
      },
    ],
    isError: true,
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
