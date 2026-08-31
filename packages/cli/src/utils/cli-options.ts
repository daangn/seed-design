import { message } from "@optique/core/message";
import { optional, withDefault } from "@optique/core/modifiers";
import type { InferValue, Mode, Parser } from "@optique/core/parser";
import { option } from "@optique/core/primitives";
import { choice, string } from "@optique/core/valueparser";
import { path } from "@optique/run/valueparser";
import { BASE_URL } from "../constants";

/**
 * What a command's handler receives: what its own parser produced, plus `--verbose`, which is
 * merged in above the command tree so it can be written on either side of the command name.
 */
export type ParsedOptions<TParser extends Parser<Mode, unknown, unknown>> = InferValue<TParser> & {
  readonly verbose: boolean;
};

/**
 * The options more than one command declares, so a flag means the same thing and answers to
 * the same names wherever it appears.
 *
 * A parser describes a flag rather than holding what was parsed from it, so one of these can
 * sit in several commands at once.
 */

export const cwdOption = withDefault(
  option("-c", "--cwd", path({ metavar: "CWD" }), {
    description: message`작업 디렉토리. 기본값은 현재 디렉토리입니다.`,
  }),
  () => process.cwd(),
);

/**
 * The same option for the commands that cannot spare `-c`: `compat` spends it on
 * `--component`, and `docs` and `docs-search` never had a short form to keep.
 */
export const cwdLongOption = withDefault(
  option("--cwd", path({ metavar: "CWD" }), {
    description: message`작업 디렉토리. 기본값은 현재 디렉토리입니다.`,
  }),
  () => process.cwd(),
);

/**
 * Every multi-word option answers to both the kebab and the camel spelling, here and in
 * `add-all`. cac derived the counterpart of a declared name on its own, so a script written
 * against any earlier release may carry either one; Optique knows only the names it is given.
 */
export const baseUrlOption = withDefault(
  option("-u", "--baseUrl", "--base-url", string({ metavar: "BASE_URL" }), {
    description: message`레지스트리의 기본 URL입니다.`,
  }),
  BASE_URL,
);

export const frameworkOption = optional(
  option("-f", "--framework", choice(["react", "lynx"]), {
    description: message`프레임워크입니다.`,
  }),
);

export const seedReactVersionOption = optional(
  option("--seed-react-version", "--seedReactVersion", string({ metavar: "VERSION" }), {
    description: message`지정한 SEED React 버전의 레지스트리를 사용합니다. 예를 들면 1.2입니다.`,
  }),
);

export const onDiffOption = optional(
  option("--on-diff", "--onDiff", choice(["overwrite", "backup"]), {
    description: message`파일 내용이 다를 때의 처리 방식입니다.`,
  }),
);
