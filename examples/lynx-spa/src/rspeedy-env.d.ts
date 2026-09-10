/// <reference types="@lynx-js/rspeedy/client" />

declare module "@karrotmarket/icon-data/*.json" {
  interface RawIconData {
    name: string;
  }

  const data: Record<string, RawIconData>;
  export default data;
}

declare module "lynx-docs-examples" {
  import type { LynxPlaygroundExample } from "../../../docs/playground/lynx/types";

  export const examples: readonly LynxPlaygroundExample[];
}
