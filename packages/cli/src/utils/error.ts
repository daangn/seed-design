import * as p from "@clack/prompts";
import { ZodError } from "zod";
import { highlight } from "./color";

interface CliErrorOptions {
  message: string;
  hint?: string;
  details?: string[];
  cause?: unknown;
}

interface HandleCliErrorOptions {
  defaultMessage: string;
  defaultHint?: string;
  verbose?: boolean;
}

interface ExecaLikeError {
  command?: string;
  escapedCommand?: string;
  exitCode?: number;
  shortMessage?: string;
  stderr?: string;
  stdout?: string;
  stack?: string;
}

export class CliError extends Error {
  hint?: string;
  details: string[];

  constructor({ message, hint, details = [], cause }: CliErrorOptions) {
    super(message, { cause });
    this.name = "CliError";
    this.hint = hint;
    this.details = details;
  }
}

export class CliCancelError extends Error {
  constructor(message = "작업이 취소됐어요.") {
    super(message);
    this.name = "CliCancelError";
  }
}

export function isCliCancelError(error: unknown): error is CliCancelError {
  return error instanceof CliCancelError;
}

export function isVerboseMode(options: unknown): boolean {
  if (!options || typeof options !== "object") return false;
  if (!("verbose" in options)) return false;

  return options.verbose === true;
}

function normalizeError(
  error: unknown,
  defaultHint?: string,
): {
  reason: string;
  hint?: string;
  details: string[];
  stack?: string;
} {
  if (error instanceof CliError) {
    return {
      reason: error.message,
      hint: error.hint ?? defaultHint,
      details: error.details,
      stack: toStack(error.cause ?? error),
    };
  }

  if (error instanceof ZodError) {
    const issues = error.issues.map((issue) => {
      const path = issue.path.join(".") || "(root)";
      return `${path}: ${issue.message}`;
    });

    return {
      reason: "입력값 또는 설정 파일 형식이 올바르지 않아요.",
      hint: defaultHint,
      details: issues,
      stack: error.stack,
    };
  }

  if (error instanceof Error) {
    const execaLike = error as ExecaLikeError;
    const details: string[] = [];

    if (execaLike.escapedCommand || execaLike.command) {
      details.push(`실행 명령어: ${execaLike.escapedCommand ?? execaLike.command}`);
    }
    if (typeof execaLike.exitCode === "number") {
      details.push(`종료 코드: ${execaLike.exitCode}`);
    }
    if (execaLike.stderr?.trim()) {
      details.push(`stderr: ${execaLike.stderr.trim()}`);
    } else if (execaLike.stdout?.trim()) {
      details.push(`stdout: ${execaLike.stdout.trim()}`);
    }

    return {
      reason: execaLike.shortMessage ?? error.message,
      hint: defaultHint,
      details,
      stack: error.stack,
    };
  }

  if (typeof error === "string") {
    return {
      reason: error,
      hint: defaultHint,
      details: [],
    };
  }

  return {
    reason: "알 수 없는 오류가 발생했어요.",
    hint: defaultHint,
    details: [],
  };
}

function toStack(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.stack;
  }

  return undefined;
}

export function handleCliError(
  error: unknown,
  { defaultMessage, defaultHint, verbose = false }: HandleCliErrorOptions,
): void {
  const normalized = normalizeError(error, defaultHint);

  p.log.error(defaultMessage);
  p.log.error(`원인: ${normalized.reason}`);

  for (const detail of normalized.details) {
    p.log.info(detail);
  }

  if (normalized.hint) {
    p.log.info(`해결 힌트: ${normalized.hint}`);
  }

  if (verbose && normalized.stack) {
    p.log.message(highlight("\n[verbose] stack trace"));
    p.log.message(normalized.stack);
  }

  p.outro(highlight("작업에 실패했어요."));
}
