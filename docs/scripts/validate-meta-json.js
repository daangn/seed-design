const Ajv = require("ajv");
const path = require("path");
const fs = require("fs");

const ajv = new Ajv();

console.log("test");

function validateJsonInDir({ dir, validate, type }) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }

        if (stats.isDirectory()) {
          fs.readdir(filePath, (err, subfiles) => {
            if (err) {
              console.error(err);
              return;
            }

            subfiles.forEach((subfile) => {
              if (path.extname(subfile) === ".json") {
                fs.readFile(
                  path.join(filePath, subfile),
                  "utf8",
                  (err, data) => {
                    if (err) {
                      console.error(err);
                      return;
                    }

                    const json = JSON.parse(data);
                    const valid = validate(json);
                    const fileName = `${json.name
                      .replaceAll(" ", "-")
                      .toLowerCase()}.json`;
                    if (!valid) {
                      console.log(`${type}/${fileName} is invalid`);
                      console.error(validate.errors);
                      process.exit(1);
                    } else {
                      console.log(`${type}/${fileName} is valid`);
                    }
                  },
                );
              }
            });
          });
        }
      });
    });
  });
}

const statusSchema = {
  type: "string",
  pattern: "^(todo|in-progress|done)$",
};

const mdxSchema = {
  type: "string",
  // eslint-disable-next-line prettier/prettier
  pattern: "^.*\.mdx$",
};

const jsonSchema = {
  type: "string",
  // eslint-disable-next-line prettier/prettier
  pattern: "^.*\.json$",
};

const pngSchema = {
  type: "string",
  // eslint-disable-next-line prettier/prettier
  pattern: "^.*\.png$",
};

const stringSchema = {
  type: "string",
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
    docs: {
      type: "object",
      properties: {
        usage: {
          type: "object",
          properties: {
            status: statusSchema,
            mdx: mdxSchema,
          },
        },
        style: {
          type: "object",
          properties: {
            status: statusSchema,
            mdx: mdxSchema,
          },
        },
      },
      required: ["usage", "style"],
      additionalProperties: false,
    },
  },
  required: ["ios", "android", "react", "docs"],
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

const componentDir = path.join(__dirname, "..", "content", "component");
const primitiveDir = path.join(__dirname, "..", "content", "primitive");

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
