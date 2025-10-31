import { defineRecipe } from "../utils/define";
import { pseudo } from "../utils/pseudo";

const article = defineRecipe({
  name: "article",
  base: {
    userSelect: "text",

    // might change to ["auto-phrase", "keep-all"] later if browser support improves && need arises
    // keep-all works as 'normal' for non-CJK languages, however if we set keep-all line break is not done as intended in ja.
    wordBreak: "normal",

    // allow breaking in long words/URLs if container is too narrow
    overflowWrap: "break-word",

    // for ja. not applied to non-CJK. prevent hanging punctuation
    lineBreak: "strict",

    [pseudo(":lang(ko)")]: {
      wordBreak: "keep-all",
    },
  },
  variants: {},
  defaultVariants: {},
});

export default article;
