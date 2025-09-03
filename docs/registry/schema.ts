import { z } from "zod";

export const registryType = z.union([
  z.literal("ui"),
  z.literal("lib"),
  z.literal("bits"),
  z.literal("breeze"),
]);

export const registryUIItemSchema = z.object({
  /**
   * @description 레지스트리 이름
   * @example chip-tabs, alert-dialog
   */
  name: z.string(),

  description: z.string().optional(),

  /**
   * @description 레지스트리 의존성
   * @example @seed-design/react-tabs
   */
  dependencies: z.array(z.string()).optional(),

  /**
   * @description 레지스트리 개발 의존성
   */
  devDependencies: z.array(z.string()).optional(),

  /**
   * @description 레지스트리 내부의 Seed Design 컴포넌트 의존성
   * * `:`를 기준으로 왼쪽은 {registryType}, 오른쪽은 파일 이름
   * @example ui:action-button
   * @example lib:manner-temp-level
   */
  innerDependencies: z.array(z.string()).optional(),

  /**
   * @description
   * 컴포넌트 코드 스니펫 경로, 여러 파일이 될 수 있어서 배열로 정의
   * `:`를 기준으로 왼쪽은 {registryType}, 오른쪽은 파일 이름
   * @example ui:alert-dialog.tsx
   * @example ui:use-dismissible.ts
   * @example lib:manner-temp-level.ts
   */
  files: z.array(z.string()),

  /**
   * @description 컴포넌트 deprecated 여부
   */
  deprecated: z.literal(true).optional(),
});
export const registryUISchema = z.array(registryUIItemSchema);

/**
 * @description 머신이 생성한 registry component schema
 */
const omittedRegistryUISchema = registryUIItemSchema.omit({
  files: true,
});
export const registryUIItemMachineGeneratedSchema = omittedRegistryUISchema.extend({
  registries: z.array(
    z.object({
      name: z.string(),
      type: registryType,
      content: z.string(),
    }),
  ),
});
export const registryComponentMachineGeneratedSchema = z.array(
  registryUIItemMachineGeneratedSchema,
);

// NOTE: 현재는 lib이 ui와 타입이 동일하지만, 따로 가져가야한다면 타입을 변경해야해요.
export const registryLibItemMachineGeneratedSchema = registryUIItemMachineGeneratedSchema;

// NOTE: 현재는 lib이 ui와 타입이 동일하지만, 따로 가져가야한다면 타입을 변경해야해요.
export type RegistryLibItem = z.infer<typeof registryUIItemSchema>;
export type RegistryLib = z.infer<typeof registryUISchema>;
export type RegistryUIItem = z.infer<typeof registryUIItemSchema>;
export type RegistryUI = z.infer<typeof registryUISchema>;

export type RegistryUIItemMachineGenerated = z.infer<typeof registryUIItemMachineGeneratedSchema>;
export type RegistryUIMachineGenerated = z.infer<typeof registryComponentMachineGeneratedSchema>;
export type RegistryLibItemMachineGenerated = z.infer<typeof registryLibItemMachineGeneratedSchema>;
export type RegistryLibMachineGenerated = z.infer<typeof registryComponentMachineGeneratedSchema>;
