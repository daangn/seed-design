const Ajv = require("ajv");
const path = require("path");
const fs = require("fs");

const ajv = new Ajv();

// component-info에 있는 모든 json 파일을 읽어서 하나의 배열로 만든다.
const componentInfoDir = path.join(__dirname, "..", "component-info");
const files = fs.readdirSync(componentInfoDir);
const componentInfos = files.map((file) => {
  const filePath = path.join(componentInfoDir, file);
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
});

const statusSchema = {
  type: "string",
  pattern: "^(todo|in-progress|done)$",
};

const mdxSchema = {
  type: "string",
  // eslint-disable-next-line prettier/prettier
  pattern: "^.*\.mdx$",
};

const titleSchema = {
  type: "string",
};

const primitiveSchema = {
  type: "object",
  properties: {
    status: statusSchema,
    mdx: mdxSchema,
  },
};

const itemsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
      platform: {
        type: "object",
        properties: {
          ios: {
            type: "object",
            properties: {
              status: statusSchema,
              alias: { type: "string" },
              path: { type: "string" },
            },
          },
          android: {
            type: "object",
            properties: {
              status: statusSchema,
              path: { type: "string" },
            },
          },
          react: {
            type: "object",
            properties: {
              status: statusSchema,
              path: { type: "string" },
            },
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
          },
        },
      },
    },
  },
};

const componentInfoSchema = {
  type: "object",
  properties: {
    title: titleSchema,
    primitive: primitiveSchema,
    items: itemsSchema,
  },
  required: ["title", "primitive", "items"],
  additionalProperties: false,
};

// 검증
const validate = ajv.compile(componentInfoSchema);

componentInfos.forEach((componentInfo) => {
  const valid = validate(componentInfo);
  const fileName = `${componentInfo.title
    .replaceAll(" ", "-")
    .toLowerCase()}.json`;
  if (!valid) {
    console.log(`${fileName} is invalid`);
    console.error(validate.errors);
    process.exit(1);
  } else {
    console.log(`${fileName} is valid`);
  }
});
