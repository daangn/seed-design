interface RegistryItemSnippet {
  path: string;
}

interface RegistryItemSnippetWithContent extends RegistryItemSnippet {
  content: string;
}

export interface RegistryItem {
  /**
   * @description Registry Item 이름
   * @example "chip-tabs"
   * @example "alert-dialog"
   */
  id: string;

  description?: string;

  /**
   * @description add 명령어 실행 시 표시하지 않음
   * @default false
   */
  hideFromCLICatalog?: boolean;

  /**
   * @description Registry Item이 포함하는 파일의 경로. 확장자 포함
   * @example [{ path: "alert-dialog.tsx" }]
   * @example [{ path: "use-dismissible.ts" }, { path: "manner-temp-level.ts" }]
   */
  snippets: RegistryItemSnippet[];

  /**
   * @description 컴포넌트 deprecated 여부
   */
  deprecated?: boolean;
}

export interface Registry {
  id: string;

  /**
   * @description add 명령어 실행 시 표시하지 않음
   * @default false
   */
  hideFromCLICatalog?: boolean;

  items: RegistryItem[];
}

/**
 * this should be in sync with `packages/cli/src/schema.ts`
 */
export interface GeneratedRegistryItem {
  /**
   * @description Registry Item 이름
   * @example "chip-tabs"
   * @example "alert-dialog"
   */
  id: string;

  description?: string;

  /**
   * @description add 명령어 실행 시 표시하지 않음
   * @default false
   */
  hideFromCLICatalog?: boolean;

  /**
   * @description 컴포넌트 deprecated 여부
   */
  deprecated?: boolean;

  /**
   * @description snippets에 명시된 파일에서 의존하는 패키지
   * @example ["@seed-design/react-tabs"]
   */
  dependencies?: string[];

  /**
   * @description snippets에 명시된 파일에서 의존하는 다른 Registry Item
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
  snippets: RegistryItemSnippetWithContent[];
}

/**
 * This excludes actual file content for lighter payload of the registry index.
 * this should be in sync with `packages/cli/src/schema.ts`
 */
export interface GeneratedRegistry {
  id: string;

  /**
   * @description add 명령어 실행 시 표시하지 않음
   * @default false
   */
  hideFromCLICatalog?: boolean;

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
    deprecated?: boolean;

    /**
     * @description snippets에 명시된 파일에서 의존하는 패키지
     * @example ["@seed-design/react-tabs"]
     */
    dependencies?: string[];

    /**
     * @description snippets에 명시된 파일에서 의존하는 다른 Registry Item
     * @example [{ registryId: "breeze", itemIds: ["animate-number"] }]
     */
    innerDependencies?: Array<{
      registryId: string;
      itemIds: string[];
    }>;

    snippets: RegistryItemSnippet[];
  }>;
}

/**
 * this should be in sync with `packages/cli/src/schema.ts`
 */
export type AvailableRegistries = Array<{ id: Registry["id"] }>;
