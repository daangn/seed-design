import type { AtRule, Container, Document, PluginCreator } from "postcss";

export interface PluginOptions {
  selector?: string;
}

function isAtRule(node: Container | Document): node is AtRule {
  return node.type === "atrule";
}

const PLUGIN_NAME = "postcss-engaged";

function isAlreadyWrapped(ancestor: Container | Document | undefined) {
  let container = ancestor;

  while (container != null && container.type !== "root") {
    if (
      isAtRule(container) &&
      (container.params.includes("hover: hover") || container.params.includes("hover: none"))
    ) {
      return true;
    }
    container = container.parent;
  }

  return false;
}

export const postcssEngaged: PluginCreator<PluginOptions> = (opts = {}) => {
  const selector = opts.selector ?? ":--engaged";
  const selectorRe = new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");

  return {
    postcssPlugin: PLUGIN_NAME,

    Rule(rule, { AtRule }) {
      if (!rule.selector.includes(selector)) {
        return;
      }

      if (isAlreadyWrapped(rule.parent)) {
        throw rule.error(
          `"${selector}" is already inside a @media (hover: ...) block. Remove the outer @media or the ${selector} pseudo-class.`,
          { plugin: PLUGIN_NAME },
        );
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
