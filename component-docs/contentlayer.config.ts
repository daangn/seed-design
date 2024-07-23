import { defineDocumentType, makeSource } from "contentlayer/source-files";

const Content = defineDocumentType(() => ({
  name: "Content",
  filePathPattern: "**/*.mdx",
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
    date: {
      type: "date",
      description: "The date of the post",
      required: true,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/contents/${doc._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "contents",
  documentTypes: [Content],
});
