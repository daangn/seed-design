import { ZodError } from "zod";

/**
 * What a command's exit code tells whatever ran it, in the shape `grep` settled on.
 *
 * The line that matters is not "did anything go wrong" but "did the command get to answer".
 * A `compat` that found incompatible snippets did its job; a `compat` that could not reach the
 * registry did not, and a CI gate unable to tell those apart reads a broken network as a
 * broken project.
 */
export const ExitCode = {
  /** The command answered. Where that answer is a verdict, it is the favourable one. */
  answered: 0,
  /**
   * The command answered, and the answer is the unfavourable one: snippets that do not fit
   * the installed packages, a query nothing matched, an address with nothing under it.
   */
  answeredNegatively: 1,
  /**
   * The command never reached an answer. The network, the arguments, the config file or the
   * file system stopped it before it could look.
   */
  unanswerable: 2,
  /**
   * The person running the command stopped it at a prompt. Neither an answer nor a failure,
   * and the same `0` as an answer, but named so a reader of the exit site can tell which of
   * the two they are looking at.
   */
  cancelled: 0,
} as const;

interface CliErrorOptions {
  message: string;
  hint?: string;
  details?: string[];
  cause?: unknown;
  /**
   * Named rather than spelled as a number, so a reader of the throw site can see which of the
   * two failures this is without going and looking up what `1` means here.
   */
  exit?: (typeof ExitCode)[keyof typeof ExitCode];
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
  exit: (typeof ExitCode)[keyof typeof ExitCode];

  constructor({
    message,
    hint,
    details = [],
    cause,
    exit = ExitCode.unanswerable,
  }: CliErrorOptions) {
    super(message, { cause });
    this.name = "CliError";
    this.hint = hint;
    this.details = details;
    this.exit = exit;
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

/**
 * What a failed child process said for itself.
 *
 * Read off the `cause` as well as off the error itself: a `CliError` wrapping an `execa`
 * rejection carries the only account of why the command failed, and dropping it leaves the
 * caller with our guess at the reason instead of npm's own.
 */
function toProcessDetails(error: unknown): string[] {
  if (!(error instanceof Error)) return [];

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

  return details;
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
      details: [...error.details, ...toProcessDetails(error.cause)],
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
    return {
      reason: (error as ExecaLikeError).shortMessage ?? error.message,
      hint: defaultHint,
      details: toProcessDetails(error),
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

/**
 * What went wrong, as plain lines, for a caller that has somewhere of its own to put them.
 *
 * Kept separate from `reportCliError` so a test can read the text without capturing a
 * stream.
 */
export function formatCliError(
  error: unknown,
  { defaultMessage, defaultHint, verbose = false }: HandleCliErrorOptions,
): string[] {
  const normalized = normalizeError(error, defaultHint);
  const lines = [defaultMessage, `원인: ${normalized.reason}`, ...normalized.details];

  if (normalized.hint) {
    lines.push(`해결 힌트: ${normalized.hint}`);
  }

  if (verbose && normalized.stack) {
    lines.push("", "[verbose] stack trace", normalized.stack);
  }

  return lines;
}

/**
 * The failure account, on stderr, where anything watching for one will find it.
 *
 * Commands differ in how they narrate progress — `docs` and `compat` print bare lines a
 * caller pipes onward, while `add` and `init` draw a clack frame around an interactive
 * session — but a failure reads the same from all of them, and never lands on stdout among
 * the results.
 */
export function reportCliError(error: unknown, options: HandleCliErrorOptions): void {
  console.error(formatCliError(error, options).join("\n"));
}

/**
 * The code to leave with after `reportCliError`.
 *
 * Anything that is not a `CliError` came from the network, a library or a bug, none of which
 * is the command answering, so it is unanswerable by default. A `CliError` says for itself.
 */
export function exitCodeFor(error: unknown) {
  return error instanceof CliError ? error.exit : ExitCode.unanswerable;
}
