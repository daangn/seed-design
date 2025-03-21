import type { GetFileNodesResponse, GetImagesResponse } from "@figma/rest-api-spec";
import fs from "fs";
import { generateCode, createRestNormalizer } from "@seed-design/figma";
import type { Logger } from "./logger";
import { NoOpLogger } from "./logger";

export interface FigmaError {
  status: number;
  err: string;
}

export interface FetchImageParams {
  /**
   * The Node in Figma that will either be rendered or have its background image downloaded
   */
  nodeId: string;
  /**
   * The file mimetype for the image
   */
  fileType: "png" | "svg";
  /**
   * The filename to save the image as
   */
  name: string;
}

export interface FigmaImage {
  nodeId: string;
  name: string;
  blob: Buffer;
  fileType: "png" | "svg";
}

export interface SimplifiedDesign {
  name: string;
  lastModified: string;
  code: string;
}

interface FigmaServiceOptions {
  apiKey: string;
  baseUrl?: string;
  logger?: Logger;
}

export class FigmaService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly logger: Logger;

  constructor(options: FigmaServiceOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || "https://api.figma.com/v1";
    this.logger = options.logger || NoOpLogger;
  }

  private async request<T>(endpoint: string): Promise<T> {
    try {
      this.logger.log(`Calling ${this.baseUrl}${endpoint}`);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "X-Figma-Token": this.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as { err?: string };
        throw {
          status: response.status,
          err: errorData.err || "Unknown error",
        } as FigmaError;
      }

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to make request to Figma API: ${error.message}`);
      }
      throw error;
    }
  }

  async getImages(fileKey: string, nodes: FetchImageParams[]): Promise<FigmaImage[]> {
    const pngNodes = nodes.filter(({ fileType }) => fileType === "png");
    const svgNodes = nodes.filter(({ fileType }) => fileType === "svg");

    const imagesMap = await this.fetchImageUrls(fileKey, pngNodes, svgNodes);

    const images = await this.fetchImage(nodes, imagesMap);

    return images;
  }

  private async fetchImageUrls(
    fileKey: string,
    pngNodes: FetchImageParams[],
    svgNodes: FetchImageParams[],
  ): Promise<Record<string, string>> {
    const pngIds = pngNodes.map(({ nodeId }) => nodeId);
    const pngFiles =
      pngIds.length > 0
        ? this.request<GetImagesResponse>(
            `/images/${fileKey}?ids=${pngIds.join(",")}&scale=2&format=png`,
          ).then(({ images = {} }) => images)
        : ({} as GetImagesResponse["images"]);

    const svgIds = svgNodes.map(({ nodeId }) => nodeId);
    const svgFiles =
      svgIds.length > 0
        ? this.request<GetImagesResponse>(
            `/images/${fileKey}?ids=${svgIds.join(",")}&format=svg`,
          ).then(({ images = {} }) => images)
        : ({} as GetImagesResponse["images"]);

    const [pngImages, svgImages] = await Promise.all([pngFiles, svgFiles]);
    const combinedImages: Record<string, string> = {};

    Object.entries({ ...pngImages, ...svgImages }).forEach(([key, value]) => {
      if (value !== null) {
        combinedImages[key] = value;
      }
    });

    return combinedImages;
  }

  private async fetchImage(
    nodes: FetchImageParams[],
    imagesMap: Record<string, string>,
  ): Promise<FigmaImage[]> {
    const fetchPromises = nodes
      .map(({ nodeId, name, fileType }) => {
        const imageUrl = imagesMap[nodeId];
        if (imageUrl) {
          return fetch(imageUrl)
            .then((response) => response.arrayBuffer())
            .then((arrayBuffer) => Buffer.from(arrayBuffer))
            .then((buffer) => {
              return {
                nodeId,
                name,
                blob: buffer,
                fileType,
              };
            })
            .catch((error) => {
              this.logger.error(`Failed to fetch image for ${nodeId}:`, error);
              return undefined;
            });
        }
        return undefined;
      })
      .filter((x): x is Promise<FigmaImage> => x !== undefined);

    return Promise.all(fetchPromises);
  }

  async getGeneratedCode(
    fileKey: string,
    nodeId: string,
    depth?: number,
  ): Promise<SimplifiedDesign> {
    const endpoint = `/files/${fileKey}/nodes?ids=${nodeId}${depth ? `&depth=${depth}` : ""}`;
    const response = await this.request<GetFileNodesResponse>(endpoint);

    this.writeDebugLogs("figma-raw.json", response);

    const node = Object.values(response.nodes)[0]!;

    const normalizer = createRestNormalizer({
      styles: node.styles,
      components: node.components,
      componentSets: node.componentSets,
    });

    const normalizedNode = normalizer(node.document);
    const code = await generateCode(normalizedNode);

    const result = {
      name: node.document.name,
      lastModified: response.lastModified,
      code,
    };

    this.writeDebugLogs("figma-result.json", result);
    return result;
  }

  private writeDebugLogs(name: string, value: any): void {
    try {
      if (process.env["NODE_ENV"] !== "development") return;

      const logsDir = "logs";

      try {
        fs.accessSync(process.cwd(), fs.constants.W_OK);
      } catch (error) {
        this.logger.error("Failed to write logs:", error);
        return;
      }

      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
      }

      fs.writeFileSync(`${logsDir}/${name}`, JSON.stringify(value, null, 2));
    } catch (error) {
      this.logger.error("Failed to write logs:", error);
    }
  }
}
