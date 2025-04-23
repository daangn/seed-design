/**
 * Custom logging module that writes to stderr instead of stdout
 * to avoid being captured in MCP protocol communication
 */

export const logger = {
  /**
   * Log an informational message
   */
  info: (message: string) => process.stderr.write(`[INFO] ${message}\n`),

  /**
   * Log a debug message
   */
  debug: (message: string) => process.stderr.write(`[DEBUG] ${message}\n`),

  /**
   * Log a warning message
   */
  warn: (message: string) => process.stderr.write(`[WARN] ${message}\n`),

  /**
   * Log an error message
   */
  error: (message: string) => process.stderr.write(`[ERROR] ${message}\n`),

  /**
   * Log a general message
   */
  log: (message: string) => process.stderr.write(`[LOG] ${message}\n`),
};

/**
 * Format an error for logging
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
