interface RegistryItemFile {
  path: string;
}

interface RegistryItemFileWithContent extends RegistryItemFile {
  content: string;
}

export interface RegistryItem {
  /**
   * @description Registry Item ID
   * @example "chip-tabs"
   * @example "alert-dialog"
   */
  id: string;

  description?: string;

  /**
   * @description Registry Item이 포함하는 파일의 경로. 확장자 포함
   * @example [{ path: "alert-dialog.tsx" }]
   * @example [{ path: "use-dismissible.ts" }, { path: "manner-temp-level.ts" }]
   */
  files: RegistryItemFile[];

  /**
   * @description 컴포넌트 deprecated 여부
   */
  deprecated?: true;
}

export interface Registry {
  id: string;
  items: RegistryItem[];
}

/**
 * this should be in sync with `packages/cli/src/schema.ts`
 */
export interface GeneratedRegistryItem {
  /**
   * @description Registry Item ID
   * @example "chip-tabs"
   * @example "alert-dialog"
   */
  id: string;

  description?: string;

  /**
   * @description 컴포넌트 deprecated 여부
   */
  deprecated?: true;

  /**
   * @description files에 명시된 파일에서 의존하는 패키지
   * @example ["@seed-design/react-tabs"]
   */
  dependencies?: string[];

  /**
   * @description files에 명시된 파일에서 의존하는 다른 Registry Item
   * @example [{ registryId: "breeze", itemIds: ["animate-number"] }]
   */
  innerDependencies?: Array<{
    registryId: string;
    itemIds: string[];
  }>;

  /**
   * @description 실제 파일의 경로와 내용
   * @example [{ path: "alert-dialog.tsx", content: "import { useState } from 'react'; ..." }]
   */
  files: RegistryItemFileWithContent[];
}

/**
 * This excludes actual file content for lighter payload of the registry index.
 * this should be in sync with `packages/cli/src/schema.ts`
 */
export interface GeneratedRegistry {
  id: string;
  items: Array<{
    /**
     * @description Registry Item ID
     * @example "chip-tabs"
     * @example "alert-dialog"
     */
    id: string;

    description?: string;

    /**
     * @description 컴포넌트 deprecated 여부
     */
    deprecated?: true;

    /**
     * @description files에 명시된 파일에서 의존하는 패키지
     * @example ["@seed-design/react-tabs"]
     */
    dependencies?: string[];

    /**
     * @description files에 명시된 파일에서 의존하는 다른 Registry Item
     * @example [{ registryId: "breeze", itemIds: ["animate-number"] }]
     */
    innerDependencies?: Array<{
      registryId: string;
      itemIds: string[];
    }>;

    files: RegistryItemFile[];
  }>;
}

/**
 * this should be in sync with `packages/cli/src/schema.ts`
 */
export interface AvailableRegistries {
  registries: Array<{
    id: string;
  }>;
}
