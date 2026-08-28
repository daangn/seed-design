import z from "zod";

const versionSchema = z
  .string()
  .trim()
  .min(1, "최소 버전을 입력해 주세요.")
  .regex(/^\d+(?:\.\d+)*$/, "버전은 숫자 점 표기법으로 입력해 주세요.");

const xElementSchema = z
  .string()
  .trim()
  .min(1, "XElement 이름을 입력해 주세요.")
  .regex(/^[a-z][a-z0-9-]*$/, "XElement 이름은 kebab-case로 입력해 주세요.");

export const lynxCompatibilitySchema = z
  .object({
    engine: versionSchema,
    "x-elements": z.array(xElementSchema).min(1).optional(),
  })
  .superRefine((compatibility, context) => {
    const names = new Set<string>();

    for (const [index, xElement] of (compatibility["x-elements"] ?? []).entries()) {
      if (names.has(xElement)) {
        context.addIssue({
          code: "custom",
          message: `XElement "${xElement}"이 중복되었습니다.`,
          path: ["x-elements", index],
        });
      }
      names.add(xElement);
    }
  });

export type LynxCompatibility = z.infer<typeof lynxCompatibilitySchema>;

export const MINIMUM_SUPPORTED_LYNX_ENGINE_VERSION = "3.6";

function isVersionLowerThan(version: string, minimum: string): boolean {
  const versionParts = version.split(".").map(Number);
  const minimumParts = minimum.split(".").map(Number);

  if (versionParts.some(Number.isNaN) || minimumParts.some(Number.isNaN)) return false;

  const partCount = Math.max(versionParts.length, minimumParts.length);

  for (let index = 0; index < partCount; index += 1) {
    const versionPart = versionParts[index] ?? 0;
    const minimumPart = minimumParts[index] ?? 0;

    if (versionPart !== minimumPart) return versionPart < minimumPart;
  }

  return false;
}

export function getEffectiveLynxCompatibility(compatibility: LynxCompatibility): LynxCompatibility {
  const engine = versionSchema.safeParse(compatibility.engine);

  if (engine.success && !isVersionLowerThan(engine.data, MINIMUM_SUPPORTED_LYNX_ENGINE_VERSION)) {
    return { ...compatibility, engine: engine.data };
  }

  return {
    ...compatibility,
    engine: MINIMUM_SUPPORTED_LYNX_ENGINE_VERSION,
  };
}

export function getLynxCompatibilityMarkdown(compatibility: LynxCompatibility): string {
  const effectiveCompatibility = getEffectiveLynxCompatibility(compatibility);
  const lines = [`Lynx Engine 최소 버전: ${effectiveCompatibility.engine}`];
  const xElements = effectiveCompatibility["x-elements"];

  if (xElements) {
    lines.push(`사용 XElement: ${xElements.map((name) => `<${name}>`).join(", ")}`);
  }

  return lines.join("\n");
}
