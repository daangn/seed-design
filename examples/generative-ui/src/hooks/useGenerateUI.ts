import { useState, useCallback, useRef } from "react";
import type { Spec } from "@json-render/core";
import { generateUI } from "@seed-design/json-render/client";
import { generateSnippetCode } from "@seed-design/json-render/generator";

interface UseGenerateUIState {
  spec: Spec | null;
  code: string;
  text: string;
  isGenerating: boolean;
  error: string | null;
}

export function useGenerateUI(apiKey: string) {
  const [state, setState] = useState<UseGenerateUIState>({
    spec: null,
    code: "",
    text: "",
    isGenerating: false,
    error: null,
  });

  const currentSpecRef = useRef<Spec | null>(null);

  const generate = useCallback(
    async (prompt: string) => {
      setState((prev) => ({
        ...prev,
        isGenerating: true,
        error: null,
        text: "",
      }));

      try {
        const result = await generateUI({
          prompt,
          currentSpec: currentSpecRef.current ?? undefined,
          apiKey,
          onPartialSpec: (partialSpec) => {
            setState((prev) => ({ ...prev, spec: partialSpec }));
          },
          onText: (text) => {
            setState((prev) => ({ ...prev, text: prev.text + text + "\n" }));
          },
        });

        currentSpecRef.current = result.spec;

        let code = "";
        try {
          code = generateSnippetCode(result.spec, {
            componentName: "GeneratedComponent",
          });
        } catch {
          code = "// Code generation failed. Spec format may not be fully supported yet.";
        }

        setState((prev) => ({
          ...prev,
          spec: result.spec,
          code,
          text: result.text,
          isGenerating: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isGenerating: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }));
      }
    },
    [apiKey],
  );

  const reset = useCallback(() => {
    currentSpecRef.current = null;
    setState({
      spec: null,
      code: "",
      text: "",
      isGenerating: false,
      error: null,
    });
  }, []);

  return { ...state, generate, reset };
}
