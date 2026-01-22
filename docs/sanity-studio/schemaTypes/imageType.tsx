import { defineField } from "sanity";

type ImageType = "upload" | "external";

// 이미지 필드 타입 정의
export const imageFieldType = defineField({
  name: "imageField",
  title: "이미지",
  type: "object",
  fields: [
    {
      name: "imageType",
      title: "이미지 타입",
      type: "string",
      options: {
        list: [
          { title: "Sanity 이미지 업로드", value: "upload" },
          { title: "외부 URL", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "upload",
      validation: (Rule) => Rule.required().valid(["upload", "external"]),
    },
    {
      name: "uploadImage",
      title: "Sanity 이미지",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.imageType !== "upload",
    },
    {
      name: "externalUrl",
      title: "외부 이미지 URL",
      type: "url",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
        }).custom((url, context) => {
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          if ((context.parent as any)?.imageType === "external" && !url) {
            return "외부 이미지 URL을 입력해주세요";
          }
          return true;
        }),
      hidden: ({ parent }) => (parent?.imageType as ImageType) !== "external",
    },
    {
      name: "alt",
      title: "대체 텍스트",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
  ],
});
