import { Api as FigmaApi } from "figma-api";
import type { GetFileNodesResponse } from "@figma/rest-api-spec";

export interface FigmaRestClient {
  getFileNodes(fileKey: string, nodeIds: string[]): Promise<GetFileNodesResponse>;
}

export function createFigmaRestClient(personalAccessToken: string): FigmaRestClient {
  const api = new FigmaApi({ personalAccessToken });

  return {
    async getFileNodes(fileKey: string, nodeIds: string[]): Promise<GetFileNodesResponse> {
      const response = await api.getFileNodes({ file_key: fileKey }, { ids: nodeIds.join(",") });

      return response;
    },
  };
}

/**
 * https://www.figma.com/:file_type/:file_key/:file_name?node-id=:id
 *
 * file_type:
 *  - design
 *  - file (legacy)
 *
 * Note: While node-id is separated by hyphens ('-') in the URL,
 * it must be converted to colons (':') when making API calls.
 * e.g. URL "node-id=794-1987" → API "794:1987"
 */
export function parseFigmaUrl(url: string): { fileKey: string; nodeId: string } {
  const __url: URL = (() => {
    try {
      return new URL(url);
    } catch {
      throw new Error(`Invalid URL format: ${url}`);
    }
  })();

  const pathMatch = __url.pathname.match(/^\/(design|file)\/([A-Za-z0-9]+)/);

  const rawNodeId = __url.searchParams.get("node-id");

  if (!pathMatch)
    throw new Error(
      "Invalid Figma URL: Expected format https://www.figma.com/design/{fileKey}/... or /file/{fileKey}/...",
    );

  if (!rawNodeId) throw new Error("Invalid Figma URL: Missing node-id query parameter");

  return {
    fileKey: pathMatch[2],
    nodeId: rawNodeId.replace(/-/g, ":"),
  };
}
