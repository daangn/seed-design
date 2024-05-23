import {
  generateCss,
  generateDts,
  generateJs,
} from "@seed-design/recipe-generator-core";
import preset from "@seed-design/recipe-generator-preset";
import fs from "fs-extra";
import path from "node:path";

const [, , format, dir = "./"] = process.argv;

async function writeCss() {
  return Promise.all(
    Object.entries(preset).map(async ([name, definition]) => {
      const cssCode = await generateCss(definition);
      console.log(
        "Writing",
        name,
        "to",
        path.join(process.cwd(), dir, `${name}.css`),
      );
      fs.writeFileSync(path.join(process.cwd(), dir, `${name}.css`), cssCode);
    }),
  );
}

async function writeCssInJs() {
  return Promise.all(
    Object.entries(preset).map(async ([name, definition]) => {
      const jsCode = generateJs(definition);
      const dtsCode = generateDts(definition);

      fs.writeFileSync(path.join(dir, `${name}.mjs`), jsCode);
      fs.writeFileSync(path.join(dir, `${name}.d.ts`), dtsCode);
    }),
  );
}

if (format === "css") {
  writeCss().then(() => {
    console.log("Done");
  });
} else if (format === "js") {
  writeCssInJs().then(() => {
    console.log("Done");
  });
} else {
  throw new Error("Invalid format");
}
