import { useState } from '@lynx-js/react';
import { Box, Text, VStack } from '@seed-design/lynx-react';

const TEXT_STYLES = [
  'screenTitle',
  't7Bold',
  't6Medium',
  't5Regular',
  't4Regular',
  't3Regular',
] as const;

function SectionTitle({ children }: { children: string }) {
  return (
    <Text textStyle="t6Bold" color="fg.neutral" style={{ marginTop: '22px' }}>
      {children}
    </Text>
  );
}

export function TextPrimitivePage() {
  const [accent, setAccent] = useState<'brand' | 'positive'>('brand');
  const isBrand = accent === 'brand';

  function switchAccent() {
    'background only';
    setAccent(isBrand ? 'positive' : 'brand');
  }

  return (
    <VStack gap="x4">
      <VStack gap="x1">
        <Text textStyle="t9Bold" color="fg.neutral">
          Text
        </Text>
        <Text textStyle="t4Regular" color="fg.neutralSubtle">
          @seed-design/lynx-react typography component
        </Text>
      </VStack>

      <SectionTitle>Text styles</SectionTitle>
      <VStack gap="x2">
        {TEXT_STYLES.map((textStyle) => (
          <Text key={textStyle} textStyle={textStyle} color="fg.neutral">
            {textStyle}
          </Text>
        ))}
      </VStack>

      <SectionTitle>Overrides</SectionTitle>
      <VStack gap="x2">
        <Text textStyle="t5Regular" color="fg.neutralSubtle">
          t5Regular with fg.neutralSubtle
        </Text>
        <Text textStyle="t5Bold" color="fg.critical">
          t5Bold with fg.critical
        </Text>
        <Text
          fontSize="t7"
          lineHeight="t7"
          fontWeight="bold"
          color="fg.informative"
        >
          fontSize / lineHeight / fontWeight overrides
        </Text>
        <Text textStyle="t4Bold" color="fg.neutral" align="center">
          align center
        </Text>
      </VStack>

      <SectionTitle>Dynamic token values</SectionTitle>
      <Box
        bindtap={switchAccent}
        bg={isBrand ? 'bg.brandWeak' : 'bg.positiveWeak'}
        borderColor={isBrand ? 'stroke.brandWeak' : 'stroke.positiveWeak'}
        borderWidth={1}
        borderRadius="r3"
        p="x4"
      >
        <VStack gap="x1">
          <Text textStyle="t5Bold" color={isBrand ? 'fg.brand' : 'fg.positive'}>
            Tap to switch Text color
          </Text>
          <Text textStyle="t3Regular" color="fg.neutralSubtle">
            Text applies token-derived color and typography as object styles.
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
}
