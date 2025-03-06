import { generateInitialSvg, generateRuntimeJs } from "./generate";
import { parseAnimation } from "./parse";
import type { CompileOutput, Ulottie } from "./types";

export class UlottieCompiler {
  /**
   * Main compile entry.
   */
  public compile(comp: Ulottie.Animation): CompileOutput {
    // 1) parse animation -> IR layers
    const irLayers = parseAnimation(comp);

    // 2) generate initial <svg>
    const initialSvg = generateInitialSvg(comp, irLayers);

    // 3) generate runtime JS
    // You can choose whether to include helperJS inline or in a separate resource.
    const runtimeJs = generateRuntimeJs(comp, irLayers);

    return { initialSvg, runtimeJs };
  }
}
