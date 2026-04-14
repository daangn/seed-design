import type { AffectedEntry, KontextConfig, Override, Relation } from "./types.js";

const CURRENT_API_VERSION = "kontext/v1";

function parseAffects(entries: Array<Record<string, unknown>>): AffectedEntry[] {
  return entries.map((entry) => ({
    path: entry.path as string,
    reason: entry.reason as string | undefined,
    generated: (entry.generated as boolean | undefined) ?? false,
    command: entry.command as string | undefined,
    optional: (entry.optional as boolean | undefined) ?? false,
  }));
}

export class SchemaValidationError extends Error {
  constructor(
    public readonly filePath: string,
    public readonly issues: string[],
  ) {
    super(`Invalid kontext.yaml at ${filePath}:\n  ${issues.join("\n  ")}`);
    this.name = "SchemaValidationError";
  }
}

function validateStringArray(value: unknown, fieldName: string, issues: string[]): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    issues.push(`${fieldName} must be an array of strings`);
    return [];
  }
  for (let i = 0; i < value.length; i++) {
    if (typeof value[i] !== "string") {
      issues.push(`${fieldName}[${i}] must be a string`);
    }
  }
  return value as string[];
}

export function validateConfig(data: unknown, filePath: string): KontextConfig {
  const issues: string[] = [];

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    issues.push("Root must be an object with apiVersion and relations");
    throw new SchemaValidationError(filePath, issues);
  }

  const obj = data as Record<string, unknown>;

  if (obj.apiVersion !== CURRENT_API_VERSION) {
    issues.push(`apiVersion must be "${CURRENT_API_VERSION}", got "${String(obj.apiVersion)}"`);
  }

  // ignore (package-level)
  const ignore = validateStringArray(obj.ignore, "ignore", issues);

  if (!Array.isArray(obj.relations)) {
    issues.push('"relations" must be an array');
    throw new SchemaValidationError(filePath, issues);
  }

  for (let i = 0; i < obj.relations.length; i++) {
    const rel = obj.relations[i] as Record<string, unknown>;
    const prefix = `relations[${i}]`;

    if (typeof rel.when !== "string" || rel.when.length === 0) {
      issues.push(`${prefix}.when must be a non-empty string`);
    }

    // exclude (relation-level)
    validateStringArray(rel.exclude, `${prefix}.exclude`, issues);

    if (!Array.isArray(rel.affects)) {
      issues.push(`${prefix}.affects must be an array`);
      continue;
    }

    for (let j = 0; j < rel.affects.length; j++) {
      const entry = rel.affects[j] as Record<string, unknown>;
      const entryPrefix = `${prefix}.affects[${j}]`;

      if (typeof entry.path !== "string" || entry.path.length === 0) {
        issues.push(`${entryPrefix}.path must be a non-empty string`);
      }
      if (entry.reason !== undefined && typeof entry.reason !== "string") {
        issues.push(`${entryPrefix}.reason must be a string`);
      }
      if (entry.generated !== undefined && typeof entry.generated !== "boolean") {
        issues.push(`${entryPrefix}.generated must be a boolean`);
      }
      if (entry.command !== undefined && typeof entry.command !== "string") {
        issues.push(`${entryPrefix}.command must be a string`);
      }
      if (entry.optional !== undefined && typeof entry.optional !== "boolean") {
        issues.push(`${entryPrefix}.optional must be a boolean`);
      }
    }

    // overrides (relation-level)
    if (rel.overrides !== undefined) {
      if (!Array.isArray(rel.overrides)) {
        issues.push(`${prefix}.overrides must be an array`);
      } else {
        for (let k = 0; k < rel.overrides.length; k++) {
          const ov = rel.overrides[k] as Record<string, unknown>;
          const ovPrefix = `${prefix}.overrides[${k}]`;

          if (typeof ov.match !== "string" || ov.match.length === 0) {
            issues.push(`${ovPrefix}.match must be a non-empty string`);
          }
          if (!Array.isArray(ov.affects)) {
            issues.push(`${ovPrefix}.affects must be an array`);
          }
        }
      }
    }
  }

  if (issues.length > 0) {
    throw new SchemaValidationError(filePath, issues);
  }

  return {
    apiVersion: CURRENT_API_VERSION,
    ignore: ignore.length > 0 ? ignore : undefined,
    relations: (obj.relations as Array<Record<string, unknown>>).map(
      (rel): Relation => ({
        when: rel.when as string,
        exclude: (rel.exclude as string[] | undefined)?.length
          ? (rel.exclude as string[])
          : undefined,
        affects: parseAffects(rel.affects as Array<Record<string, unknown>>),
        overrides: Array.isArray(rel.overrides)
          ? (rel.overrides as Array<Record<string, unknown>>).map(
              (ov): Override => ({
                match: ov.match as string,
                affects: parseAffects(ov.affects as Array<Record<string, unknown>>),
              }),
            )
          : undefined,
      }),
    ),
  };
}
