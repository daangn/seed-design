// @ts-nocheck

const ContentText = styled('p', {
  ...userSelectText,
  overflow: 'hidden',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  color: '$gray900',
  variants: {
    size: {
      medium: {
        $text: "t5Regular",
      },
      large: {
        $text: "articleBody",
      },
    },
  },
});
