import { ImageIcon } from "@sanity/icons";
import { defineArrayMember, defineType } from "sanity";
import { doDontType } from "./doDontType";
import { cardsType } from "./card";

// 외부 이미지 링크 타입 정의
export const externalImageLinkType = defineArrayMember({
  name: "externalImageLink",
  title: "외부 이미지 링크",
  type: "object",
  fields: [
    {
      name: "imageUrl",
      title: "이미지 URL",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({
          scheme: ["http", "https"],
        }),
    },
    {
      name: "alt",
      title: "대체 텍스트",
      type: "string",
    },
  ],
  preview: {
    select: {
      imageUrl: "imageUrl",
      title: "alt",
    },
    prepare({ imageUrl, title }) {
      return {
        title: title || "외부 이미지 링크",
        media: () => (
          <img
            src={imageUrl}
            alt={title || "미리보기 이미지"}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        ),
      };
    },
  },
});

// imageWithText를 defineArrayMember로 정의
export const imageWithTextType = defineArrayMember({
  name: "imageWithText",
  title: "이미지 텍스트 조합",
  type: "object",
  fields: [
    {
      name: "image",
      title: "이미지",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "text",
      title: "텍스트",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "본문", value: "normal" },
            { title: "제목", value: "h3" },
            { title: "부제목", value: "h4" },
          ],
          marks: {
            decorators: [
              { title: "굵게", value: "strong" },
              { title: "기울임", value: "em" },
              { title: "밑줄", value: "underline" },
            ],
          },
        },
      ],
    },
    {
      name: "imagePosition",
      title: "이미지 위치",
      type: "string",
      options: {
        list: [
          { title: "왼쪽", value: "left" },
          { title: "오른쪽", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "left",
    },
  ],
  preview: {
    select: {
      title: "text",
      media: "image",
      imagePosition: "imagePosition",
    },
    prepare({ title, media, imagePosition }) {
      return {
        title: title?.[0]?.children?.[0]?.text || "이미지 텍스트 블록",
        subtitle: `이미지 위치: ${imagePosition === "left" ? "왼쪽" : "오른쪽"}`,
        media,
      };
    },
  },
});

// You can add additional types here. Note that you can't use
// primitive types such as 'string' and 'number' in the same array
// as a block type.
export const imageType = defineArrayMember({
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    {
      name: "alt",
      type: "string",
      title: "Alternative Text",
    },
  ],
});

export const tableType = defineArrayMember({
  name: "tabelContainer",
  title: "Table",
  type: "document",
  fields: [
    {
      // Include the table as a field
      // Giving it a semantic title
      name: "table",
      title: "Table",
      type: "table",
    },
  ],
});

const DescriptionStyle = (props: any) => (
  <span style={{ fontSize: "14px" }}>{props.children} </span>
);

export default defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      // Styles let you define what blocks can be marked up as. The default
      // set corresponds with HTML tags, but you can set any title or value
      // you want, and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Description", value: "description", component: DescriptionStyle },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Number", value: "number" },
      ],
      // Marks let you mark up inline text in the Portable Text Editor
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url",
              },
            ],
          },
        ],
      },
    }),
    imageType,
    doDontType,
    tableType,
    imageWithTextType,
    externalImageLinkType,
    cardsType,
  ],
});
