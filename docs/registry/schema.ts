export interface Registry {
  id: string;

  /**
   * @description add 명령어 실행 시 표시하지 않음
   * @default false
   */
  hideFromCLICatalog?: boolean;

  items: {
    /**
     * @description Registry Item 이름
     * @example "chip-tabs"
     * @example "alert-dialog"
     */
    id: string;

    description?: string;

    /**
     * @description Registry Item deprecated 여부
     */
    deprecated?: boolean;

    /**
     * @description add 명령어 실행 시 표시하지 않음
     * @default false
     */
    hideFromCLICatalog?: boolean;

    /**
     * @description Registry Item이 포함하는 스니펫
     * @example [{ path: "alert-dialog.tsx" }]
     * @example [{ path: "use-dismissible.ts" }, { path: "manner-temp-level.ts" }]
     */
    snippets: {
      /**
       * @description 스니펫 파일 경로
       */
      path: string;
      /**
       * @description 스니펫 파일에서 의존하는 \@seed-design/* 패키지와 버전. 스니펫 내부에 \@requires로 기록됨
       * @example { "@seed-design/react": "^1.1.0", "@seed-design/css": "^1.1.0" }
       * @see https://github.com/npm/node-semver#caret-ranges-123-025-004
       */
      dependencies?: Record<string, string>;
    }[];
  }[];
}

/**
 * this should be in sync with `packages/cli/src/schema.ts`
 */
export interface GeneratedRegistryItem
  extends Pick<
    Registry["items"][number],
    "id" | "description" | "deprecated" | "hideFromCLICatalog"
  > {
  /**
   * @description snippets에 명시된 파일에서 의존하는 패키지. CLI가 실제로 설치함
   * @example ["@seed-design/react-tabs"]
   */
  dependencies?: string[];

  /**
   * @description snippets에 명시된 파일에서 의존하는 다른 Registry Item. CLI가 실제로 추가함
   * @example [{ registryId: "breeze", itemIds: ["animate-number"] }]
   */
  innerDependencies?: Array<{
    registryId: string;
    itemIds: string[];
  }>;

  /**
   * @description Registry Item이 포함하는 스니펫의 실제 파일 경로와 내용
   * @example [{ path: "alert-dialog.tsx", content: "import { useState } from 'react'; ..." }]
   */
  snippets: {
    /**
     * @description 스니펫 파일 경로
     */
    path: string;

    /**
     * @description 스니펫 파일에서 의존하는 \@seed-design/* 패키지와 버전
     * @example { "@seed-design/react": "~1.1.0", "@seed-design/css": "~1.1.0" }
     */
    dependencies?: Record<string, string>;

    /**
     * @description 스니펫 파일 내용
     */
    content: string;
  }[];
}

/**
 * this should be in sync with `packages/cli/src/schema.ts`
 */

export interface GeneratedRegistry extends Pick<Registry, "id" | "hideFromCLICatalog"> {
  items: Array<
    Pick<
      GeneratedRegistryItem,
      | "id"
      | "description"
      | "deprecated"
      | "hideFromCLICatalog"
      | "dependencies"
      | "innerDependencies"
    > & {
      // excludes actual file content for lighter payload of the registry index.
      snippets: {
        /**
         * @description 스니펫 파일 경로
         */
        path: string;
        /**
         * @description 스니펫 파일에서 의존하는 \@seed-design/* 패키지와 버전
         */
        dependencies?: Record<string, string>;
      }[];
    }
  >;
}

/**
 * this should be in sync with `packages/cli/src/schema.ts`
 */
export type AvailableRegistries = Array<{ id: Registry["id"] }>;
