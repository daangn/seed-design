import tailwindcss from "@tailwindcss/postcss";

function lynxTailwindCompatibility() {
  return {
    postcssPlugin: "lynx-tailwind-compatibility",
    OnceExit(root) {
      root.walkRules((rule) => {
        // Lynx는 `:root, :host` 묶음 규칙을 통째로 제거하므로 `:root`만 남긴다.
        const selectors = rule.selectors;
        if (selectors.length === 2 && selectors.includes(":root") && selectors.includes(":host")) {
          rule.selector = ":root";
        }
      });

      // Lynx는 `@layer`를 지원하지 않으므로 선언된 위치에 내용을 펼친다.
      const layers = [];
      root.walkAtRules("layer", (rule) => {
        layers.push(rule);
      });
      for (const rule of layers.reverse()) {
        if (rule.nodes) rule.replaceWith(rule.nodes);
        else rule.remove();
      }
    },
  };
}

export default {
  plugins: [tailwindcss(), lynxTailwindCompatibility()],
};
