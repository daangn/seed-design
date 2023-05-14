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

export const componentMetaSchema = {
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

export const primitiveMetaSchema = {
  type: "object",
  properties: {
    name: stringSchema,
    description: stringSchema,
    thumbnail: pngSchema,
    primitivie: mdxSchema,
  },
  required: ["name", "description", "thumbnail", "primitive"],
};
