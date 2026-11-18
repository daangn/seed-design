import { z } from "astro/zod";
import { COVER_IMAGE_PATH_ERROR_MESSAGE, isValidCoverImagePath } from "../cover-image";
import { lynxCompatibilitySchema } from "../lynx-compatibility";
import { updatesFrontmatterSchema } from "../updates-frontmatter";
import type { SectionId } from "../../src/content/sections";

// content schema는 `astro/zod`로 만든다. docs의 `zod`(4.4)로 만든 schema는 Astro의 zod(4.6)와 타입 버전이 달라
// `defineCollection`에 넘길 수 없다. fumadocs-core의 `pageSchema`·`metaSchema`도 docs 쪽 zod라 같은 필드를 여기 둔다.

/** docs `zod`로 만든 공유 schema(다른 코드와 함께 쓰는 검증 규칙)를 Astro schema 안에서 그대로 실행한다. */
function sharedSchema<Output>(schema: {
  safeParse(
    value: unknown,
  ):
    | { success: true; data: Output }
    | { success: false; error: { issues: Array<{ message: string; path: PropertyKey[] }> } };
}) {
  return z.unknown().transform((value, context): Output => {
    const result = schema.safeParse(value);
    if (result.success) return result.data;
    for (const issue of result.error.issues) {
      context.addIssue({ code: "custom", message: issue.message, path: issue.path });
    }
    return z.NEVER;
  });
}

/** fumadocs-core `pageSchema`와 같은 필드. */
const fumadocsPageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  full: z.boolean().optional(),
});

/**
 * 모든 문서 컬렉션이 공유하는 frontmatter 베이스입니다.
 *
 * - `deprecated`: 페이지나 컴포넌트의 지원 중단 표시
 * - `layout`: 표준 문서와 자체 overview 레이아웃 구분
 * - `featured`: 사이드바 라벨 뒤의 강조 점 표시
 */
const baseDocsSchema = fumadocsPageSchema.extend({
  deprecated: z.boolean().optional(),
  layout: z.enum(["docs", "overview"]).default("docs"),
  featured: z.boolean().optional(),
});

const staticCoverImageSchema = {
  coverImage: z
    .string()
    .refine(isValidCoverImagePath, { message: COVER_IMAGE_PATH_ERROR_MESSAGE })
    .optional(),
};

const headingSchema = {
  heading: z.string().optional(),
};

/** fumadocs-core `metaSchema`와 같은 필드 + `layout: "tabs"`인 meta.json의 고정 헤더 데이터. */
export const docsMetaSchema = z.object({
  title: z.string().optional(),
  pages: z.array(z.string()).optional(),
  pagesIndex: z.string().optional(),
  description: z.string().optional(),
  root: z.union([z.boolean(), z.string()]).optional(),
  defaultOpen: z.boolean().optional(),
  collapsible: z.boolean().optional(),
  icon: z.string().optional(),
  layout: z.enum(["tabs"]).optional(),
  ...staticCoverImageSchema,
});

const designSchema = baseDocsSchema.extend({
  coverImageFigmaId: z.string().optional(),
  ...staticCoverImageSchema,
  ...headingSchema,
});

const platformSchema = baseDocsSchema.extend({ ...staticCoverImageSchema, ...headingSchema });

export const pageSchemas = {
  docs: baseDocsSchema.extend({ coverImageFigmaId: z.string().optional() }),
  "get-started": designSchema,
  foundations: designSchema,
  components: designSchema.extend({
    componentIds: z.array(z.string()).optional(),
    // 영문 이름과 한글 검색어가 다른 컴포넌트를 검색 다이얼로그의 컴포넌트 카드에서 찾을 수
    // 있게 하는 별칭입니다 (`메뉴` → Menu). 문서 본문 검색에는 반영되지 않습니다.
    keywords: z.array(z.string()).optional(),
  }),
  patterns: designSchema,
  react: platformSchema,
  breeze: baseDocsSchema,
  lynx: platformSchema.extend({
    compatibility: z.object({ lynx: sharedSchema(lynxCompatibilitySchema) }).optional(),
  }),
  "ai-integration": platformSchema,
  updates: sharedSchema(updatesFrontmatterSchema),
} satisfies Record<SectionId, z.ZodType>;
