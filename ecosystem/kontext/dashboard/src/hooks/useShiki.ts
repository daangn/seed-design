import { useCallback, useEffect, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Highlighter = any;

let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = import("shiki/bundle/web").then((mod) =>
      mod.createHighlighter({
        themes: ["github-dark-dimmed"],
        langs: [
          "typescript",
          "tsx",
          "javascript",
          "jsx",
          "css",
          "json",
          "yaml",
          "html",
          "markdown",
          "mdx",
          "bash",
        ],
      }),
    );
  }
  return highlighterPromise;
}

export function useShiki() {
  const [isReady, setIsReady] = useState(false);
  const hlRef = useRef<Highlighter | null>(null);

  useEffect(() => {
    getHighlighter().then((hl) => {
      hlRef.current = hl;
      setIsReady(true);
    });
  }, []);

  const highlight = useCallback(
    (code: string, lang: string): string | null => {
      if (!hlRef.current) return null;
      try {
        const loadedLangs = hlRef.current.getLoadedLanguages();
        const safeLang = loadedLangs.includes(lang) ? lang : "text";
        return hlRef.current.codeToHtml(code, {
          lang: safeLang,
          theme: "github-dark-dimmed",
          transformers: [
            {
              pre(node: { properties?: { style?: string } }) {
                // Remove background color to match dashboard theme
                if (node.properties?.style) {
                  node.properties.style = (node.properties.style as string).replace(
                    /background-color:[^;]+;?/,
                    "",
                  );
                }
              },
            },
          ],
        });
      } catch {
        return null;
      }
    },
    [isReady],
  );

  return { highlight, isReady };
}

const EXT_TO_LANG: Record<string, string> = {
  ".ts": "typescript",
  ".tsx": "tsx",
  ".js": "javascript",
  ".jsx": "jsx",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".css": "css",
  ".json": "json",
  ".yaml": "yaml",
  ".yml": "yaml",
  ".html": "html",
  ".md": "markdown",
  ".mdx": "mdx",
  ".sh": "bash",
  ".bash": "bash",
  ".toml": "text",
  ".txt": "text",
};

export function extToLang(ext: string): string {
  return EXT_TO_LANG[ext] ?? "text";
}
