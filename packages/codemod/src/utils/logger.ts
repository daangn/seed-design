import { createLogger, format, transports } from "winston";

export interface TransformResult {
  previousToken: string;
  nextToken: string | null;
  line?: number;
  status: "success" | "failure" | "warning";
  failureReason?: string;
  description?: string;
  needsVerification?: boolean;
}

export function createTransformLogger(transformName: string) {
  // success 파일용 포맷 (SUCCESS 로그만 포함)
  const successFormat = format.printf(({ message, timestamp, metadata }) => {
    const { previousToken, nextToken, line } = metadata as TransformResult;
    const lineInfo = line ? `(line ${line})` : "";
    return `${timestamp} ${message}: ${previousToken} → ${nextToken} ${lineInfo}`;
  });

  // issues 파일용 포맷 (ERROR 및 WARNING 로그만 포함)
  const issuesFormat = format.printf(({ level, message, timestamp, failureReason, metadata }) => {
    const { previousToken, description } = metadata as TransformResult;
    const reason = description || failureReason || "";
    return `${timestamp} [${level.toUpperCase()}]: ${message}\n ↳ reason: ${previousToken} ${reason}`;
  });

  // debug 파일용 포맷
  const debugFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  });

  // success 파일에는 success 상태의 로그만 기록하기 위한 필터
  const successFilter = format((info) => {
    const metadata = info.metadata as TransformResult | undefined;
    if (metadata?.status === "success") {
      return info;
    }
    return false;
  });

  // issues 파일에는 failure 또는 warning 상태의 로그만 기록하기 위한 필터
  const issuesFilter = format((info) => {
    const metadata = info.metadata as TransformResult | undefined;
    if (metadata?.status === "failure" || metadata?.status === "warning") {
      return info;
    }
    return false;
  });

  const logger = createLogger({
    level: "debug",
    transports: [
      new transports.File({
        filename: `.report/${transformName}-success.log`,
        format: format.combine(
          successFilter(),
          format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          successFormat,
        ),
      }),
      new transports.File({
        filename: `.report/${transformName}-issues.log`,
        format: format.combine(
          issuesFilter(),
          format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          issuesFormat,
        ),
      }),
      new transports.File({
        filename: `.report/${transformName}-debug.log`,
        level: "debug",
        format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), debugFormat),
      }),
    ],
  });

  return {
    logger,
    logTransformResult(filePath: string, result: TransformResult) {
      const { status, failureReason, needsVerification, description, previousToken, nextToken } =
        result;
      const logLevel = status === "success" ? "info" : status === "warning" ? "warn" : "error";
      const lineInfo = result.line ? `(line: ${result.line})` : "";

      // 성공 로그 생성
      logger.log({
        level: logLevel,
        message: `${filePath} ${lineInfo}`,
        ...(failureReason && { failureReason }),
        ...(description && { description }),
        metadata: result,
      });

      // needsVerification이 true인 경우, 별도로 warning 로그도 생성
      if (needsVerification && status === "success") {
        logger.log({
          level: "warn",
          message: `${filePath} ${lineInfo}`,
          metadata: {
            previousToken,
            nextToken,
            status: "warning",
            description: description || "사용 확인 필요한 토큰입니다",
            needsVerification: true,
            line: result.line,
          },
        });
      }
    },
    startFile(filePath: string) {
      logger.debug(`Starting transformation of ${filePath}`);
    },
    finishFile(filePath: string) {
      logger.debug(`Finished transformation of ${filePath}`);
    },
  };
}
