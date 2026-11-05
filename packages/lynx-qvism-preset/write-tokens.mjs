import fs from "node:fs";
import path from "node:path";

const raw = fs.readFileSync(path.join(import.meta.dirname, "./src/token.css"), "utf8");

const tokensTs = `export const tokens = {
  _raw: \`${raw}\`
};`;

fs.writeFileSync(path.join(import.meta.dirname, "./src/tokens.ts"), tokensTs);
