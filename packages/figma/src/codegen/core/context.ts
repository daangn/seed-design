import { AsyncLocalStorage } from "async_hooks";

export interface CodegenOptions {
  shouldInferAutoLayout: boolean;
  shouldInferVariableName: boolean;
}

export const codegenOptionsContext = new AsyncLocalStorage<CodegenOptions>();

export function useCodegenOptions(): CodegenOptions {
  const options = codegenOptionsContext.getStore();

  if (!options) {
    throw new Error(
      "Trying to get codegen options outside of codegen context. Did you forget to call `codegenOptionsContext.run`?",
    );
  }

  return options;
}
