import { baseUrl } from "@/app/metadata";

export const revalidate = false;

/**
 * @deprecated This endpoint has been moved to /ai-integration/llms.txt
 * This file is kept for backward compatibility and will redirect users to the new location.
 */
export async function GET() {
  const newUrl = new URL("/ai-integration/llms.txt", baseUrl);

  const response = `# SEED Design AI Integration - Moved

This documentation has been moved to a new location.

## New Location

Please use the new AI Integration section:
- Entry point: ${newUrl}
- MCP documentation: ${new URL("/ai-integration/mcp", baseUrl)}
- LLMs.txt guide: ${new URL("/ai-integration/llms-txt", baseUrl)}

## Why the change?

AI Integration documentation has been consolidated into a dedicated section that covers all SEED Design platforms (React, Docs, Breeze, Lynx).

## All llms.txt Entry Points

- Root: ${new URL("/llms.txt", baseUrl)}
- Design: ${new URL("/docs/llms.txt", baseUrl)}
- React: ${new URL("/react/llms.txt", baseUrl)}
- Breeze: ${new URL("/breeze/llms.txt", baseUrl)}
- Lynx: ${new URL("/lynx/llms.txt", baseUrl)}
- AI Integration: ${newUrl}
`;

  return new Response(response);
}
