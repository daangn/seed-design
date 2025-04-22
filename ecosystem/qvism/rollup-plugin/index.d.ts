import type { Plugin } from "rollup";

interface QvismPluginOptions {
  recipePath: string;
}
declare function qvism(options: QvismPluginOptions): Plugin;

export { qvism as default };
