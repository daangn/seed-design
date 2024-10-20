import { type LoggerOptions, format, transports } from "winston";

export const loggerOptions: LoggerOptions = {
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      ({ level, message, timestamp }) => `${timestamp} [${level.toUpperCase()}]: ${message}`,
    ),
  ),
  transports: [
    new transports.File({ filename: "combined.log", level: "debug" }),
    new transports.File({ filename: "error.log", level: "error" }),
  ],
};
