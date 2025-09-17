import { z } from "zod";

const registryItemFileSchema = z.object({
  path: z.string(),
});

const registryItemFileWithContentSchema = registryItemFileSchema.extend({
  content: z.string(),
});

const registryItemSchema = z.object({
  /**
   * @description Registry Item 이름
   * @example "chip-tabs"
   * @example "alert-dialog"
   */
  name: z.string(),

  description: z.string().optional(),

  /**
   * @description Registry Item이 포함하는 파일의 경로. 확장자 포함
   * @example [{ path: "alert-dialog.tsx" }]
   * @example [{ path: "use-dismissible.ts" }, { path: "manner-temp-level.ts" }]
   */
  files: z.array(registryItemFileSchema),

  /**
   * @description 컴포넌트 deprecated 여부
   */
  deprecated: z.literal(true).optional(),
});

const registrySchema = z.object({
  name: z.string(),
  items: z.array(registryItemSchema),
});

const generatedRegistryItemSchema = registryItemSchema.omit({ files: true }).extend({
  /**
   * @description files에 명시된 파일에서 의존하는 패키지
   * @example ["@seed-design/react-tabs"]
   */
  dependencies: z.array(z.string()).optional(),

  /**
   * @description files에 명시된 파일에서 의존하는 다른 Registry Item
   * @example [{ registryName: "breeze", itemNames: ["animate-number"] }]
   */
  innerDependencies: z
    .array(
      z.object({
        registryName: registrySchema.shape.name,
        itemNames: z.array(registryItemSchema.shape.name),
      }),
    )
    .optional(),

  /**
   * @description 실제 파일의 경로와 내용
   * @example [{ path: "alert-dialog.tsx", content: "import { useState } from 'react'; ..." }]
   */
  files: z.array(registryItemFileWithContentSchema),
});

const generatedRegistrySchema = z.object({
  name: registrySchema.shape.name,
  items: z.array(
    generatedRegistryItemSchema
      .omit({ files: true })
      .extend({ files: z.array(registryItemFileSchema) }),
  ),
});

export type RegistryItem = z.infer<typeof registryItemSchema>;
export type Registry = z.infer<typeof registrySchema>;

export type GeneratedRegistryItem = z.infer<typeof generatedRegistryItemSchema>;

/**
 * This excludes `files` content for lighter payload of the registry index.
 */
export type GeneratedRegistry = z.infer<typeof generatedRegistrySchema>;
