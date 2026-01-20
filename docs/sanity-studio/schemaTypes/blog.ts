import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "blog",
  title: "블로그",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "컨텐츠 제목",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "카테고리",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "description",
      title: "컨텐츠 설명",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "컨텐츠 url",
      type: "slug",
      options: {
        source: "title",
        slugify: (input) => input.toLowerCase().replace(/\s+/g, "-").slice(0, 200),
      },
    }),
    defineField({
      name: "thumbnail",
      title: "컨텐츠 썸네일",
      description: "썸네일은 16:9 비율의 이미지를 사용해주세요. 안그러면 짤려요.",
      type: "image",
    }),
    defineField({
      name: "content",
      title: "컨텐츠 내용",
      description: "컨텐츠 내용을 입력해주세요.",
      type: "blockContent",
    }),
    defineField({
      name: "publishedAt",
      title: "컨텐츠 출시일",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category.title",
    },
  },
});
