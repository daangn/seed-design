/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_DOCS_ARCHIVE_CHANNEL?: string;
  readonly NEXT_PUBLIC_LYNX_BUNDLE_ORIGIN?: string;
  readonly NEXT_PUBLIC_POSTHOG_HOST?: string;
  readonly NEXT_PUBLIC_POSTHOG_KEY?: string;
  readonly NEXT_PUBLIC_SANITY_API_VERSION?: string;
  readonly NEXT_PUBLIC_SANITY_DATASET?: string;
  readonly NEXT_PUBLIC_SANITY_PROJECT_ID?: string;
  readonly NEXT_PUBLIC_STACKFLOW_SPA_URL?: string;
}

// `.ts` 모듈에서 `.astro` 컴포넌트를 import할 수 있게 한다(예: `src/components/mdx/components.ts`).
declare module "*.astro" {
  const Component: import("astro/runtime/server/index.js").AstroComponentFactory;
  export default Component;
}
