import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer as createMcpServer } from "./server.js";
import { initializeTools } from "./tools/index.js";

export interface HttpServerOptions {
  host?: string;
  port?: number;
  path?: string;
  baseUrl?: string;
  enableJsonResponse?: boolean;
  enableDnsRebindingProtection?: boolean;
  allowedHosts?: string[];
  allowedOrigins?: string[];
}

const defaultHost = "127.0.0.1";
const defaultPort = 3100;
const defaultPath = "/mcp";
const maxBodyBytes = 1_048_576; // 1MB

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let totalBytes = 0;
  for await (const chunk of req) {
    const buf = Buffer.from(chunk);
    totalBytes += buf.length;
    if (totalBytes > maxBodyBytes) {
      throw Object.assign(new Error("Request body too large"), { statusCode: 413 });
    }
    chunks.push(buf);
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw Object.assign(new Error("Invalid JSON body"), { statusCode: 400 });
  }
}

async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
  options: Required<Pick<HttpServerOptions, "path" | "enableJsonResponse">> &
    Pick<HttpServerOptions, "enableDnsRebindingProtection" | "allowedHosts" | "allowedOrigins">,
  initializeOptions: Pick<HttpServerOptions, "baseUrl">,
): Promise<void> {
  const reqUrl = new URL(req.url ?? "/", "http://localhost");
  if (reqUrl.pathname !== options.path) {
    res.statusCode = 404;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: "Not Found" }));
    return;
  }

  const server = createMcpServer();
  await initializeTools(server, initializeOptions);

  const parsedBody = req.method === "POST" ? await readJsonBody(req) : undefined;
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: options.enableJsonResponse,
    enableDnsRebindingProtection: options.enableDnsRebindingProtection,
    allowedHosts: options.allowedHosts,
    allowedOrigins: options.allowedOrigins,
  });

  res.on("close", () => {
    void server.close();
    void transport.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, parsedBody);
}

export async function startHttpServer(options: HttpServerOptions = {}) {
  const resolvedOptions = {
    host: options.host ?? process.env.SEED_DOCS_MCP_HOST ?? defaultHost,
    port: options.port ?? Number(process.env.PORT ?? defaultPort),
    path: options.path ?? process.env.SEED_DOCS_MCP_PATH ?? defaultPath,
    enableJsonResponse: options.enableJsonResponse ?? true,
    enableDnsRebindingProtection: options.enableDnsRebindingProtection ?? false,
    allowedHosts: options.allowedHosts,
    allowedOrigins: options.allowedOrigins,
  };
  const initializeOptions = {
    baseUrl: options.baseUrl,
  };

  const httpServer = createServer(async (req, res) => {
    try {
      await handleRequest(req, res, resolvedOptions, initializeOptions);
    } catch (error) {
      if (!res.headersSent) {
        const statusCode = (error as { statusCode?: number }).statusCode ?? 500;
        res.statusCode = statusCode;
        res.setHeader("content-type", "application/json");
        res.end(
          JSON.stringify({
            jsonrpc: "2.0",
            error: {
              code: -32603,
              message: error instanceof Error ? error.message : "Internal server error",
            },
            id: null,
          }),
        );
      }
    }
  });

  await new Promise<void>((resolve, reject) => {
    httpServer.listen(resolvedOptions.port, resolvedOptions.host, () => resolve());
    httpServer.on("error", reject);
  });

  return {
    host: resolvedOptions.host,
    port: resolvedOptions.port,
    path: resolvedOptions.path,
    close: async () => {
      await new Promise<void>((resolve, reject) => {
        httpServer.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    },
  };
}
