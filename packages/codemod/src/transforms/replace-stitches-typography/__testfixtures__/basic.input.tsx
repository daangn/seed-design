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
    },
  },
});
