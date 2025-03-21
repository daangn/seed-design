import type { GetFileNodesResponse } from "@figma/rest-api-spec";
import fs from "fs";
import { generateCode } from "../src/generate-code";
import { createRestNormalizer } from "../src/normalizer/from-rest";

const response = JSON.parse(fs.readFileSync("./fixture.json", "utf8")) as GetFileNodesResponse;

const node = Object.values(response.nodes)[0]!;
const normalizer = createRestNormalizer({
  styles: node.styles,
  components: node.components,
  componentSets: node.componentSets,
});
const normalizedNode = normalizer(node.document);
const code = await generateCode(normalizedNode);
const simplifiedDesign = {
  name: node.document.name,
  lastModified: response.lastModified,
  thumbnailUrl: response.thumbnailUrl,
  code,
};
console.log(simplifiedDesign.code);
