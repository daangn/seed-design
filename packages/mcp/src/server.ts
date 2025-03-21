import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import express, { type Request, type Response } from "express";
import type { IncomingMessage, ServerResponse } from "node:http";
import { z } from "zod";
import { type FigmaImage, FigmaService } from "./figma";
import type { Logger } from "./logger";
import { ConsoleLogger, NoOpLogger, createMcpLogger } from "./logger";

// Constants
const SERVER_INFO = {
  name: "SEED Figma MCP Server",
  version: "0.0.1",
};

// Tool schemas
const getFigmaCodegenSchema = {
  fileKey: z
    .string()
    .describe(
      "The key of the Figma file to fetch, often found in a provided URL like figma.com/(file|design)/<fileKey>/...",
    ),
  nodeId: z
    .string()
    .regex(/^\d+:\d+$/, "Node ID must be in format integer:integer")
    .describe(
      "The ID of the node to fetch, formatted as 1234:5678. Convert 1234-5678 to 1234:5678",
    ),
  depth: z
    .number()
    .optional()
    .describe(
      "How many levels deep to traverse the node tree, only use if explicitly requested by the user",
    ),
};

const fetchFigmaImagesSchema = {
  fileKey: z.string().describe("The key of the Figma file containing the node"),
  nodes: z
    .object({
      nodeId: z
        .string()
        .regex(/^\d+:\d+$/, "Node ID must be in format integer:integer")
        .describe(
          "The ID of the Figma image node to fetch, formatted as 1234:5678. Convert 1234-5678 to 1234:5678",
        ),
      name: z.string().describe("The name of the fetched file"),
    })
    .array()
    .describe("The nodes to fetch as images"),
};

export class FigmaMcpServer {
  private readonly server: McpServer;
  private figmaService: FigmaService;
  private sseTransport: SSEServerTransport | null = null;
  private logger: Logger = NoOpLogger;
  private readonly figmaApiKey: string;

  private images = new Map<string, Omit<FigmaImage, "blob"> & { base64: string }>();

  /**
   * Creates a new Figma MCP Server
   */
  constructor(figmaApiKey: string) {
    this.figmaApiKey = figmaApiKey;
    this.figmaService = new FigmaService({
      apiKey: figmaApiKey,
      logger: this.logger,
    });

    this.server = new McpServer(SERVER_INFO, {
      capabilities: {
        logging: {},
        tools: {},
        resources: {},
      },
    });

    this.registerTools();
    this.registerImageResources();
  }

  /**
   * Registers all available tools with the MCP server
   */
  private registerTools(): void {
    this.registerGetFigmaCodegenTool();
    this.registerFetchFigmaImagesTool();
  }

  /**
   * Registers the get_figma_codegen tool
   */
  private registerGetFigmaCodegenTool(): void {
    this.server.tool(
      "get_figma_codegen",
      "Fetch the generated code of a Figma file node",
      getFigmaCodegenSchema,
      async ({ fileKey, nodeId, depth }) => {
        try {
          this.logger.log(
            `Fetching ${
              depth ? `${depth} layers deep` : "all layers"
            } of node ${nodeId} from file ${fileKey} at depth: ${depth ?? "all layers"}`,
          );

          const file = await this.figmaService.getGeneratedCode(fileKey, nodeId, depth);

          this.logger.log(`Successfully fetched file: ${file.name}`);

          return {
            content: [{ type: "text", text: JSON.stringify(file) }],
          };
        } catch (error) {
          this.logger.error(`Error fetching file ${fileKey}:`, error);
          return {
            content: [{ type: "text", text: `Error fetching file: ${error}` }],
          };
        }
      },
    );
  }

  /**
   * Registers the fetch_figma_images tool
   */
  private registerFetchFigmaImagesTool(): void {
    this.server.tool(
      "fetch_figma_images",
      "Fetch SVG and PNG images used in a Figma file based on the IDs",
      fetchFigmaImagesSchema,
      async ({ fileKey, nodes }) => {
        try {
          const renderRequests = nodes.map(({ nodeId, name }) => ({
            nodeId,
            name,
            fileType: name.endsWith(".svg") ? ("svg" as const) : ("png" as const),
          }));

          const images = await this.figmaService.getImages(fileKey, renderRequests);

          const imageCount = images.length;
          const successMessage = `Success, ${imageCount} images fetched: ${images.map((image) => image.nodeId).join(", ")}`;

          images.forEach((image) => {
            this.images.set(image.nodeId, {
              name: image.name,
              fileType: image.fileType,
              nodeId: image.nodeId,
              base64: image.blob.toString("base64"),
            });
          });

          // Notify clients that the resources list has changed
          this.server.server.notification({
            method: "notifications/resources/list_changed",
          });

          return {
            content: [
              {
                type: "text",
                text: imageCount > 0 ? successMessage : "No images were fetched",
              },
            ],
          };
        } catch (error) {
          this.logger.error(`Error fetching images from file ${fileKey}:`, error);
          return {
            content: [{ type: "text", text: `Error fetching images: ${error}` }],
          };
        }
      },
    );
  }

  /**
   * Registers resources for Figma images
   */
  private registerImageResources(): void {
    // Register resource template for all Figma images
    this.server.resource(
      "figma_images",
      new ResourceTemplate("image://{nodeId}", {
        list: async () => {
          return {
            resources: Array.from(this.images.entries()).map(([nodeId, image]) => ({
              name: `Figma Image ${nodeId}`,
              uri: `image://${nodeId}`,
              mimeType: image.fileType === "svg" ? "image/svg+xml" : "image/png",
              description: `Figma image with ID ${nodeId} (${image.fileType})`,
            })),
          };
        },
      }),
      async (uri, variables) => {
        const nodeId = variables["nodeId"] as string;
        const image = this.images.get(nodeId);

        if (!image) {
          throw new Error(`Image not found for nodeId: ${nodeId}`);
        }

        return {
          contents: [
            {
              uri: uri.href,
              mimeType: image.fileType === "svg" ? "image/svg+xml" : "image/png",
              blob: image.base64,
            },
          ],
        };
      },
    );
  }

  /**
   * Updates the logger and recreates the FigmaService with the new logger
   */
  private updateLogger(newLogger: Logger): void {
    this.logger = newLogger;
    this.figmaService = new FigmaService({
      apiKey: this.figmaApiKey,
      logger: this.logger,
    });
  }

  /**
   * Connects the server to a transport
   */
  async connect(transport: Transport): Promise<void> {
    await this.server.connect(transport);

    // Set up logging to the MCP client
    const mcpLogger = createMcpLogger((message) => {
      this.server.server.sendLoggingMessage(message);
    });

    this.updateLogger(mcpLogger);
    this.logger.log("Server connected and ready to process requests");
  }

  /**
   * Starts an HTTP server to serve the MCP API
   */
  async startHttpServer(port: number): Promise<void> {
    const app = express();

    // Set up SSE endpoint for MCP communication
    app.get("/sse", async (_req: Request, res: Response) => {
      console.log("New SSE connection established");
      this.sseTransport = new SSEServerTransport(
        "/messages",
        res as unknown as ServerResponse<IncomingMessage>,
      );

      // Work around for Bun
      res.write('event: log\ndata: "dummy event for bun workaround"\n\n');

      await this.server.connect(this.sseTransport);
    });

    // Set up message endpoint for MCP communication
    app.post("/messages", async (req: Request, res: Response) => {
      if (!this.sseTransport) {
        res.sendStatus(400);
        return;
      }

      await this.sseTransport.handlePostMessage(
        req as unknown as IncomingMessage,
        res as unknown as ServerResponse<IncomingMessage>,
      );
    });

    // Set up console logging
    this.updateLogger(ConsoleLogger);

    // Start the server
    app.listen(port, () => {
      this.logger.log(`HTTP server listening on port ${port}`);
      this.logger.log(`SSE endpoint available at http://localhost:${port}/sse`);
      this.logger.log(`Message endpoint available at http://localhost:${port}/messages`);
    });
  }
}
