// const path = require("node:path");
import Ajv from "ajv";
import { prettify } from "awesome-ajv-errors";
import fs from "node:fs/promises";
import path from "node:path";

const ajv = new Ajv();

console.log("Validating meta.json files...");

async function validateJsonInDir({ dir, validate, type }) {
  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);

      const stats = await fs.stat(filePath);

      if (!stats.isDirectory()) {
        continue;
      }

      const subfiles = await fs.readdir(filePath);

      for (const subfile of subfiles) {
        if (path.extname(subfile) !== ".json") {
          continue;
        }

        const data = await fs.readFile(path.join(filePath, subfile), "utf8");

        const json = JSON.parse(data);
        const isValid = validate(json);
        const fileName = `${json.name.replaceAll(" ", "-").toLowerCase()}.json`;

        if (!isValid) {
          console.log(`${type}/${fileName} is invalid`);
          console.error(prettify(validate, { data: json }));

          process.exit(1);
        } else {
          // console.log(`${type}/${fileName} is valid`);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

const statusSchema = {
  type: "string",
  pattern: "^(todo|in-progress|done)$",
};

const stringSchema = {
  type: "string",
};

const storybookSchema = {
  type: "object",
  properties: {
    path: stringSchema,
    height: { type: ["string"] },
  },
  required: ["path"],
  additionalProperties: false,
};

const mdxSchema = {
  type: "string",
  pattern: "^.*.mdx$",
};

const jsonSchema = {
  type: "string",
  pattern: "^.*.json$",
};

const pngSchema = {
  type: "string",
  pattern: "^.*.png$",
};

const platformSchema = {
  type: "object",
  properties: {
    ios: {
      type: "object",
      properties: {
        status: statusSchema,
        alias: { type: "string" },
        path: { type: "string" },
      },
      required: ["status", "alias", "path"],
      additionalProperties: false,
    },
    android: {
      type: "object",
      properties: {
        status: statusSchema,
        path: { type: "string" },
      },
      required: ["status", "path"],
      additionalProperties: false,
    },
    react: {
      type: "object",
      properties: {
        status: statusSchema,
        path: { type: "string" },
      },
      required: ["status", "path"],
      additionalProperties: false,
    },
    figma: {
      type: "object",
      properties: {
        status: statusSchema,
        path: { type: "string" },
      },
      required: ["status", "path"],
      additionalProperties: false,
    },
    docs: {
      type: "object",
      properties: {
        overview: {
          type: "object",
          properties: {
            status: statusSchema,
            storybook: storybookSchema,
            mdx: mdxSchema,
          },
          additionalProperties: false,
        },
        usage: {
          type: "object",
          properties: {
            status: statusSchema,
            mdx: mdxSchema,
          },
          additionalProperties: false,
        },
        style: {
          type: "object",
          properties: {
            status: statusSchema,
            mdx: mdxSchema,
            additionalProperties: false,
          },
        },
      },
      required: ["usage", "style", "overview"],
      additionalProperties: true,
    },
  },
  required: ["ios", "android", "react", "figma", "docs"],
  additionalProperties: false,
};

const componentMetaSchema = {
  type: "object",
  properties: {
    name: stringSchema,
    description: stringSchema,
    thumbnail: pngSchema,
    primitive: jsonSchema,
    group: stringSchema,
    platform: platformSchema,
  },
  required: ["name", "description", "thumbnail", "platform"],
};

const primitiveMetaSchema = {
  type: "object",
  properties: {
    name: stringSchema,
    description: stringSchema,
    thumbnail: pngSchema,
    primitivie: mdxSchema,
  },
  required: ["name", "description", "thumbnail", "primitive"],
};

const componentDir = path.resolve("./content/component");
const primitiveDir = path.resolve("./content/primitive");

const componentValidate = ajv.compile(componentMetaSchema);
const primitiveValidate = ajv.compile(primitiveMetaSchema);

validateJsonInDir({
  dir: componentDir,
  validate: componentValidate,
  type: "component",
});
validateJsonInDir({
  dir: primitiveDir,
  validate: primitiveValidate,
  type: "primitive",
});

console.log("Finished validating meta.json files");
