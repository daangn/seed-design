import type { PluginCreator } from "postcss";

export interface PluginOptions {
  selector?: string;
}

function isAlreadyWrapped(rule: { parent: { type: string; params?: string; parent: any } | null }) {
  let container = rule.parent;
  while (container !== null && container.type !== "root") {
    if (
      container.type === "atrule" &&
      (container.params?.includes("hover: hover") || container.params?.includes("hover: none"))
    ) {
      return true;
    }
    container = container.parent;
  }
  return false;
}

const postcssEngaged: PluginCreator<PluginOptions> = (opts = {}) => {
  const selector = opts.selector ?? ":--engaged";
  const selectorRe = new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");

  return {
    postcssPlugin: "postcss-engaged",

    Rule(rule, { AtRule }) {
      if (!rule.selector.includes(selector) || isAlreadyWrapped(rule)) {
        return;
      }

      const hoverSelector = rule.selector.replace(selectorRe, ":hover");
      const activeSelector = rule.selector.replace(selectorRe, ":is(:active, [data-active])");

      const hoverRule = rule.clone({ selector: hoverSelector });
      const hoverMedia = new AtRule({ name: "media", params: "(hover: hover)" });
      hoverMedia.source = rule.source;
      hoverMedia.append(hoverRule);

      const activeRule = rule.clone({ selector: activeSelector });
      const activeMedia = new AtRule({ name: "media", params: "(hover: none)" });
      activeMedia.source = rule.source;
      activeMedia.append(activeRule);

      rule.after(activeMedia);
      rule.after(hoverMedia);
      rule.remove();
    },
  };
};

postcssEngaged.postcss = true;

export default postcssEngaged;
