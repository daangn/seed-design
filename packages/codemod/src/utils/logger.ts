import { createLogger, format, transports } from "winston";

export interface TransformResult {
  previousToken: string;
  nextToken: string | null;
  line?: number;
  status: "success" | "failure" | "warning";
  failureReason?: string;
}

export function createTransformLogger(transformName: string) {
  const logger = createLogger({
    level: "debug",
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.printf(({ level, message, timestamp, ...meta }) => {
        const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
        return `${timestamp} [${level.toUpperCase()}] ${transformName}: ${message}${metaString}`;
      }),
    ),
    transports: [
      new transports.File({
        filename: `.report/${transformName}-success.log`,
        level: "info",
        format: format.combine(
          format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          format.printf(({ message, timestamp, ...meta }) => {
            const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
            return `${timestamp} [SUCCESS] ${transformName}: ${message}${metaString}`;
          }),
        ),
      }),
      new transports.File({
        filename: `.report/${transformName}-issues.log`,
        level: "warn",
        format: format.combine(
          format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          format.printf(({ level, message, timestamp, ...meta }) => {
            const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
            return `${timestamp} [${level.toUpperCase()}] ${transformName}: ${message}${metaString}`;
          }),
        ),
      }),
      new transports.File({
        filename: `.report/${transformName}-debug.log`,
        level: "debug",
      }),
      new transports.Console({
        level: process.env.LOG === "true" ? "debug" : "info",
      }),
    ],
  });

  return {
    logger,
    logTransformResult(filePath: string, result: TransformResult) {
      const { status, previousToken, nextToken, line, failureReason } = result;
      const logLevel = status === "success" ? "info" : status === "warning" ? "warn" : "error";
      const lineInfo = line ? `(line: ${line})` : "";
      const message = `${filePath}${lineInfo}: ${previousToken} -> ${nextToken || "undefined"}`;

      logger.log({
        level: logLevel,
        message,
        ...(failureReason && { failureReason }),
        metadata: result,
      });
    },
    startFile(filePath: string) {
      logger.debug(`Starting transformation of ${filePath}`);
    },
    finishFile(filePath: string) {
      logger.debug(`Finished transformation of ${filePath}`);
    },
  };
}
