import { CliCancelError } from "./error";

/**
 * Whether a prompt can be answered where this process is running.
 *
 * Both streams have to be a terminal. clack reads the answer off stdin and draws the question
 * on stdout, so a piped stdout paints a selector into something nobody is watching, and a
 * stdin that is not a terminal never delivers an answer at all: `setRawMode` is guarded by
 * `isTTY`, so the prompt raises nothing and simply waits. A closed stdin then leaves the
 * `await` unsettled until the event loop empties and Node exits `0` with the work undone; an
 * open pipe leaves it waiting for as long as the caller allows.
 */
export function canPrompt() {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

/**
 * Throws `CliCancelError` when the user cancelled the prompt that returned `answer`.
 *
 * Checked with `typeof` rather than `p.isCancel`: clack types `isCancel` as narrowing to its own
 * cancel symbol while `multiselect` returns a bare `symbol`, so the answer's type still carries
 * `symbol` after an `isCancel` check.
 */
export function assertAnswered<T>(answer: T | symbol): asserts answer is T {
  if (typeof answer === "symbol") throw new CliCancelError();
}
