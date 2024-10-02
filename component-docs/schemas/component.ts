import { z } from "zod";

export const componentMetadataSchema = z.object({
  /**
   * @description 컴포넌트 이름
   * @example chip-tabs, alert-dialog
   */
  name: z.string(),

  description: z.string().optional(),

  /**
   * @description 컴포넌트 의존성
   * @example @seed-design/react-tabs
   */
  dependencies: z.array(z.string()).optional(),

  /**
   * @description 컴포넌트 개발 의존성
   */
  devDependencies: z.array(z.string()).optional(),

  /**
   * @description 컴포넌트 내부의 Seed Design 컴포넌트 의존성
   * @example action-button
   */
  innerDependencies: z.array(z.string()).optional(),

  /**
   * @description 컴포넌트 코드 스니펫 경로, 여러 파일이 될 수 있어서 배열로 정의
   * @example component/alert-dialog.tsx
   */
  snippets: z.array(z.string()),

  /**
   * @description 컴포넌트 타입
   * pattern, component과 같은 타입들이 추가될 수 있음.
   */
  type: z.enum(["component"]),
});

export const componentRegistrySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  innerDependencies: z.array(z.string()).optional(),
  registries: z.array(
    z.object({
      name: z.string(),
      content: z.string(),
    }),
  ),
  type: z.enum(["component"]),
});

export type ComponentMetadataSchema = z.infer<typeof componentMetadataSchema>;
export type ComponentRegistrySchema = z.infer<typeof componentRegistrySchema>;
