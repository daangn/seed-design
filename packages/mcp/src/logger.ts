/**
 * Centralized logger module for the Figma MCP Server
 */
export interface Logger {
  log(...args: any[]): void;
  error(...args: any[]): void;
}

/**
 * Default logger implementation that does nothing
 */
export const NoOpLogger: Logger = {
  log: () => {},
  error: () => {},
};

/**
 * Logger that writes to the console
 */
export const ConsoleLogger: Logger = {
  log: console.log,
  error: console.error,
};

/**
 * Creates a logger that sends messages to an MCP server
 */
export function createMcpLogger(sendLoggingMessage: (message: any) => void): Logger {
  return {
    log: (...args: any[]) => {
      sendLoggingMessage({
        level: "info",
        data: args,
      });
    },
    error: (...args: any[]) => {
      sendLoggingMessage({
        level: "error",
        data: args,
      });
    },
  };
}
