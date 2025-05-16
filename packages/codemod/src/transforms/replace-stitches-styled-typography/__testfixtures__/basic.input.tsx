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
        $text: 'bodyM1Regular',
      },
      large: {
        $text: 'bodyL1Regular',
      },
      xlarge: {
        $text: "h4",
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
        $typography: 'bodyM1Regular',
      },
      large: {
        $typography: 'bodyL1Regular',
      },
      xlarge: {
        $typography: "h4",
      },
    },
  },
});
