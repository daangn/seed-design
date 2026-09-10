/// <reference types="@lynx-js/rspeedy/client" />

declare module "@karrotmarket/icon-data/*.json" {
  interface RawIconData {
    name: string;
  }

  const data: Record<string, RawIconData>;
  export default data;
}
