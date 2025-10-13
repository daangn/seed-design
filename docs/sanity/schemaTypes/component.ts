import { ComponentIcon } from "@sanity/icons";
import { defineField, defineType, ALL_FIELDS_GROUP } from "sanity";

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
    {
      name: "figma",
      title: "Figma",
    },
    {
      name: "react",
      title: "React",
    },
    {
      name: "ios",
      title: "iOS",
    },
    {
      name: "android",
      title: "Android",
    },
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
    defineField({
      name: "iosStatus",
      title: "구현 상태",
      type: "string",
      options: {
        list: [
          { title: "✅ 준비됨", value: "ready" },
          { title: "❌ 준비안됨", value: "not-ready" },
          { title: "🚧 작업중", value: "in-progress" },
          { title: "⚠️ 사용중단", value: "deprecated" },
        ],
      },
      initialValue: "not-ready",
      group: "ios",
    }),
    defineField({
      name: "iosUrl",
      title: "Repository URL or Internal Link",
      description: "예: https://github.com/... 또는 /react/components/action-button",
      type: "string",
      group: "ios",
    }),
    defineField({
      name: "androidStatus",
      title: "구현 상태",
      type: "string",
      options: {
        list: [
          { title: "✅ 준비됨", value: "ready" },
          { title: "❌ 준비안됨", value: "not-ready" },
          { title: "🚧 작업중", value: "in-progress" },
          { title: "⚠️ 사용중단", value: "deprecated" },
        ],
      },
      initialValue: "not-ready",
      group: "android",
    }),
    defineField({
      name: "androidUrl",
      title: "Repository URL or Internal Link",
      description: "예: https://github.com/... 또는 /react/components/action-button",
      type: "string",
      group: "android",
    }),
    defineField({
      name: "reactStatus",
      title: "구현 상태",
      type: "string",
      options: {
        list: [
          { title: "✅ 준비됨", value: "ready" },
          { title: "❌ 준비안됨", value: "not-ready" },
          { title: "🚧 작업중", value: "in-progress" },
          { title: "⚠️ 사용중단", value: "deprecated" },
        ],
      },
      initialValue: "not-ready",
      group: "react",
    }),
    defineField({
      name: "reactUrl",
      title: "Repository URL or Internal Link",
      description: "예: https://github.com/... 또는 /react/components/action-button",
      type: "string",
      group: "react",
    }),
    defineField({
      name: "figmaStatus",
      title: "구현 상태",
      type: "string",
      options: {
        list: [
          { title: "✅ 준비됨", value: "ready" },
          { title: "❌ 준비안됨", value: "not-ready" },
          { title: "🚧 작업중", value: "in-progress" },
          { title: "⚠️ 사용중단", value: "deprecated" },
        ],
      },
      initialValue: "not-ready",
      group: "figma",
    }),
    defineField({
      name: "figmaUrl",
      title: "File URL or Internal Link",
      description: "예: https://figma.com/... 또는 /react/components/action-button",
      type: "string",
      group: "figma",
    }),
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
