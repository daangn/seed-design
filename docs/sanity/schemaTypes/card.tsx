import { defineArrayMember } from "sanity";

export const cardType = defineArrayMember({
  name: "card",
  title: "카드",
  type: "object",
  fields: [
    {
      name: "title",
      title: "제목",
      type: "string",
    },
    {
      name: "description",
      title: "설명",
      type: "text",
    },
    {
      name: "href",
      title: "링크",
      type: "url",
    },
  ],
});

export const cardsType = defineArrayMember({
  name: "cards",
  title: "카드 목록",
  type: "object",
  fields: [
    {
      name: "cards",
      title: "카드",
      type: "array",
      of: [cardType],
    },
  ],
});
