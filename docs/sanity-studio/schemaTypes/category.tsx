import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "카테고리",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "카테고리 이름",
      type: "string",
    }),
  ],
});
