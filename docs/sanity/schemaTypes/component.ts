import { ComponentIcon } from "@sanity/icons";
import { defineField, defineType, ALL_FIELDS_GROUP } from "sanity";

const statusOptions = [
  { title: "✅ 준비됨", value: "ready" },
  { title: "❌ 준비안됨", value: "not-ready" },
  { title: "🚧 작업중", value: "in-progress" },
  { title: "⚠️ 사용중단", value: "deprecated" },
];

const platforms = [
  { key: "figma", title: "Figma", urlLabel: "File URL or Internal Link" },
  { key: "react", title: "React", urlLabel: "Repository URL or Internal Link" },
  { key: "ios", title: "iOS", urlLabel: "Repository URL or Internal Link" },
  { key: "android", title: "Android", urlLabel: "Repository URL or Internal Link" },
] as const;

export default defineType({
  name: "component",
  title: "컴포넌트",
  type: "document",
  icon: ComponentIcon,
  groups: [
    {
      name: "basic",
      title: "기본 정보",
      default: true,
    },
    ...platforms.map((platform) => ({
      name: platform.key,
      title: platform.title,
    })),
    {
      ...ALL_FIELDS_GROUP,
      hidden: true,
    },
  ],
  fields: [
    defineField({
      name: "id",
      title: "컴포넌트 ID",
      description: "예: action-button",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: "basic",
    }),
    defineField({
      name: "name",
      title: "컴포넌트 이름",
      description: "예: Action Button",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: "basic",
    }),
    defineField({
      name: "deprecated",
      title: "사용 중단 여부",
      type: "boolean",
      initialValue: false,
      group: "basic",
    }),
    defineField({
      name: "deprecatedMessage",
      title: "사용 중단 메시지",
      type: "string",
      hidden: ({ document }) => !document?.deprecated,
      group: "basic",
    }),
    ...platforms.flatMap((platform) => [
      defineField({
        name: `${platform.key}Status`,
        title: "구현 상태",
        type: "string",
        options: {
          list: statusOptions,
        },
        initialValue: "not-ready",
        group: platform.key,
      }),
      defineField({
        name: `${platform.key}Url`,
        title: platform.urlLabel,
        description: "예: https://github.com/... 또는 /react/components/action-button",
        type: "string",
        group: platform.key,
      }),
      defineField({
        name: `${platform.key}Note`,
        title: "비고",
        description: "플랫폼별 추가 정보나 특이사항을 입력하세요",
        type: "text",
        rows: 3,
        group: platform.key,
      }),
    ]),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "id",
      deprecated: "deprecated",
    },
    prepare(selection) {
      const { title, subtitle, deprecated } = selection;
      return {
        title: deprecated ? `${title} (Deprecated)` : title,
        subtitle: subtitle,
      };
    },
  },
});
