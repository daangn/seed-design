import { z } from "zod";

export const registryComponentItemSchema = z.object({
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
  files: z.array(z.string()),
});
export const registryComponentSchema = z.array(registryComponentItemSchema);

/**
 * @description 머신이 생성한 registry component schema
 */
const omittedRegistryComponentSchema = registryComponentItemSchema.omit({
  files: true,
});
export const registryComponentItemMachineGeneratedSchema =
  omittedRegistryComponentSchema.extend({
    registries: z.array(
      z.object({
        name: z.string(),
        content: z.string(),
      }),
    ),
  });
export const registryComponentMachineGeneratedSchema = z.array(
  registryComponentItemMachineGeneratedSchema,
);

export type RegistryComponentItem = z.infer<typeof registryComponentItemSchema>;
export type RegistryComponent = z.infer<typeof registryComponentSchema>;
export type RegistryComponentItemMachineGenerated = z.infer<
  typeof registryComponentItemMachineGeneratedSchema
>;
export type RegistryComponentMachineGenerated = z.infer<
  typeof registryComponentMachineGeneratedSchema
>;
