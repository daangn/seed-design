import type { GetFileNodesResponse } from "@figma/rest-api-spec";
import fs from "fs";
import { generateCode, generateFigmaSummary } from "../src/codegen";
import { createRestNormalizer } from "../src/normalizer/from-rest";

const node = JSON.parse(
  fs.readFileSync("./fixtures/fixture.json", "utf8"),
) as GetFileNodesResponse["nodes"]["string"];

const normalizer = createRestNormalizer({
  styles: node.styles,
  components: node.components,
  componentSets: node.componentSets,
});
const normalizedNode = normalizer(node.document);
const code = generateCode(normalizedNode, {
  shouldInferAutoLayout: true,
  shouldInferVariableName: true,
});
const simplifiedDesign = {
  name: node.document.name,
  code,
};
console.log(simplifiedDesign.code);
