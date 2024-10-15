import path from "node:path";
import fs from "node:fs";

const EXAMPLE_PATH = path.join(process.cwd(), "components", "example");

// read files from path and then generate the index.json containing key-value pairs of the file name and the file content
const files = fs.readdirSync(EXAMPLE_PATH);

const example = Object.fromEntries(
  files
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => {
      const filePath = path.join(EXAMPLE_PATH, file);
      const content = fs.readFileSync(filePath, "utf8");

      return [
        file.replace(".tsx", ""),
        content.replace('"use client";', "").trim(),
      ];
    }),
);

const exampleJson = JSON.stringify(example, null, 2);

const targetPath = path.join(EXAMPLE_PATH, "index.json");

fs.writeFileSync(targetPath, exampleJson, "utf8");
