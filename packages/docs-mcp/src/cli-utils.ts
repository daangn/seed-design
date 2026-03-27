export interface CliOptions {
  baseUrl?: string;
}

export function parseCliOptions(argv: string[]): CliOptions {
  let baseUrl: string | undefined;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg) {
      continue;
    }

    if (arg === "--base-url") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error("Missing value for --base-url");
      }
      baseUrl = value;
      index += 1;
      continue;
    }

    if (arg.startsWith("--base-url=")) {
      const value = arg.slice("--base-url=".length);
      if (!value) {
        throw new Error("Missing value for --base-url");
      }
      baseUrl = value;
    }
  }

  return {
    baseUrl,
  };
}
