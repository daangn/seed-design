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
   * @description add 명령어 실행 시
   * @property {false} CLI에서 숨기지 않음. CLI를 통해 검색 및 추가 가능
   * @property {"from-catalog"} CLI에서 숨김. 이름을 지정하여 추가하는 것은 가능
   * @property {"completely"} CLI에서 완전히 숨김. 검색 및 이름 지정하여 추가 불가능하며 다른 스니펫의 innerDependency로만 사용 가능
   * @default false
   */
  hideFromCLIAdd: z
    .boolean()
    // .literal(false)
    // .or(z.literal("from-catalog"))
    // .or(z.literal("completely"))
    .optional(),

  /**
   * @description 실제 파일의 경로와 내용
   * @example [{ path: "alert-dialog.tsx", content: "import { useState } from 'react'; ..." }]
   */
  snippets: z.array(z.object({ path: z.string(), content: z.string() })),

  /**
   * @description 컴포넌트 deprecated 여부
   */
  deprecated: z.boolean().optional(),
  /**
   * @description snippets에 명시된 파일에서 의존하는 패키지
   * @example ["@seed-design/react-tabs"]
   */
  dependencies: z.array(z.string()).optional(),

  /**
   * @description snippets에 명시된 파일에서 의존하는 다른 Registry Item
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
      .omit({ snippets: true })
      .extend({ snippets: z.array(z.object({ path: z.string() })) }),
  ),
});

/**
 * this should be in sync with `packages/cli/src/schema.ts`
 */
export const publicAvailableRegistriesSchema = z.array(z.object({ id: z.string() }));

export type PublicRegistryItem = z.infer<typeof publicRegistryItemSchema>;
export type PublicRegistry = z.infer<typeof publicRegistrySchema>;
export type PublicAvailableRegistries = z.infer<typeof publicAvailableRegistriesSchema>;
