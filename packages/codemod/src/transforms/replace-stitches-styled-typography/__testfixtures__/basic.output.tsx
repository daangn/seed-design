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
      xlarge: {
        $text: "t10Bold",
      },
    },
  },
});

const ContentText2 = styled('p', {
  ...userSelectText,
  overflow: 'hidden',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  color: '$gray900',
  variants: {
    size: {
      medium: {
        $typography: "t5Regular",
      },
      large: {
        $typography: "articleBody",
      },
      xlarge: {
        $typography: "t10Bold",
      },
    },
  },
});
