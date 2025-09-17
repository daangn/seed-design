import { z } from "zod";

/**
 * this should be in sync with `docs/registry/schema.ts`
 */
export const publicRegistryItemSchema = z.object({
  /**
   * @description Registry Item 이름
   * @example "chip-tabs"
   * @example "alert-dialog"
   */
  id: z.string(),

  description: z.string().optional(),

  /**
   * @description add 명령어 실행 시 표시하지 않음
   * @default false
   */
  hideFromCLICatalog: z.boolean().optional(),

  /**
   * @description 실제 파일의 경로와 내용
   * @example [{ path: "alert-dialog.tsx", content: "import { useState } from 'react'; ..." }]
   */
  files: z.array(z.object({ path: z.string(), content: z.string() })),

  /**
   * @description 컴포넌트 deprecated 여부
   */
  deprecated: z.literal(true).optional(),
  /**
   * @description files에 명시된 파일에서 의존하는 패키지
   * @example ["@seed-design/react-tabs"]
   */
  dependencies: z.array(z.string()).optional(),

  /**
   * @description files에 명시된 파일에서 의존하는 다른 Registry Item
   * @example [{ registryId: "breeze", itemIds: ["animate-number"] }]
   */
  innerDependencies: z
    .array(
      z.object({
        registryId: z.string(),
        itemIds: z.array(z.string()),
      }),
    )
    .optional(),
});

/**
 * this should be in sync with `packages/cli/src/schema.ts`
 */
export const publicRegistrySchema = z.object({
  id: z.string(),

  /**
   * @description add 명령어 실행 시 표시하지 않음
   * @default false
   */
  hideFromCLICatalog: z.boolean().optional(),

  items: z.array(
    publicRegistryItemSchema
      .omit({ files: true })
      .extend({ files: z.array(z.object({ path: z.string() })) }),
  ),
});

/**
 * this should be in sync with `packages/cli/src/schema.ts`
 */
export const publicAvailableRegistriesSchema = z.array(z.object({ id: z.string() }));

export type PublicRegistryItem = z.infer<typeof publicRegistryItemSchema>;
export type PublicRegistry = z.infer<typeof publicRegistrySchema>;
export type PublicAvailableRegistries = z.infer<typeof publicAvailableRegistriesSchema>;
