import { type LoggerOptions, format, transports } from "winston";

export const loggerOptions: LoggerOptions = {
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss", // Customize the timestamp format if needed
    }),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    }),
  ),
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log", level: "debug" }),
  ],
  exitOnError: false,
  handleExceptions: true,
  exceptionHandlers: [new transports.File({ filename: "./exceptions.log" })],
};
