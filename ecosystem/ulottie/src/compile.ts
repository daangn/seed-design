export function compileUlottie(raw: any, opts?: GeneratorOptions): string {
  // 1) parse
  const comp = parseUlottie(raw);
  // 2) analyze
  const analysis = analyzeUlottie(comp);
  // 3) generate code
  return generateUlottieCode(comp, analysis, opts);
}
