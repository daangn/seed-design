declare module "@babel/plugin-transform-typescript";

declare module "@npmcli/disparity-colors" {
  /**
   * Colorizes unified diff output with ANSI escape codes.
   *
   * @param str - A unified diff format string.
   * @param opts.headerLength - Number of lines at the start of the diff to colorize as header.
   */
  export default function colorize(str: string, opts?: { headerLength?: number }): string;
}
