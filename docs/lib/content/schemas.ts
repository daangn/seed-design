import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import z from "zod";
import { COVER_IMAGE_PATH_ERROR_MESSAGE, isValidCoverImagePath } from "../cover-image";
import { lynxCompatibilitySchema } from "../lynx-compatibility";
import { updatesFrontmatterSchema } from "../updates-frontmatter";
import type { ContentCollectionName } from "./satteri-options";

/**
 * 모든 문서 컬렉션이 공유하는 frontmatter 베이스입니다.
 *
 * - `deprecated`: 페이지나 컴포넌트의 지원 중단 표시
 * - `layout`: 표준 문서와 자체 overview 레이아웃 구분
 * - `featured`: 사이드바 라벨 뒤의 강조 점 표시
 */
const baseDocsSchema = pageSchema.extend({
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

/** `layout: "tabs"`인 meta.json의 고정 헤더 데이터를 보존합니다. */
export const docsMetaSchema = metaSchema.extend({
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
    compatibility: z
      .object({
        lynx: lynxCompatibilitySchema,
      })
      .optional(),
  }),
  "ai-integration": platformSchema,
  updates: updatesFrontmatterSchema,
} satisfies Record<ContentCollectionName, z.ZodType>;
