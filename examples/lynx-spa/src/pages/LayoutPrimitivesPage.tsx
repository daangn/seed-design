import { useState } from '@lynx-js/react';
import { Box, HStack, Text, VStack } from '@seed-design/lynx-react';
import type * as React from 'react';

const STRESS_ITEMS = Array.from({ length: 72 }, (_, index) => index);
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

function CodeLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text textStyle="t2Regular" color="fg.neutralSubtle">
      {children}
    </Text>
  );
}

function Surface({
  title,
  description,
  tone,
}: {
  title: string;
  description: string;
  tone: 'brand' | 'positive' | 'informative';
}) {
  const toneStyle = {
    brand: {
      bg: 'bg.brandWeak',
      borderColor: 'stroke.brandWeak',
      color: 'fg.brand',
    },
    positive: {
      bg: 'bg.positiveWeak',
      borderColor: 'stroke.positiveWeak',
      color: 'fg.positive',
    },
    informative: {
      bg: 'bg.informativeWeak',
      borderColor: 'stroke.informativeWeak',
      color: 'fg.informative',
    },
  }[tone];

  return (
    <Box
      bg={toneStyle.bg}
      borderColor={toneStyle.borderColor}
      borderWidth={1}
      borderRadius="r3"
      p="x4"
    >
      <VStack gap="x1">
        <Text textStyle="t5Bold" color={toneStyle.color}>
          {title}
        </Text>
        <Text textStyle="t3Regular" color="fg.neutralSubtle">
          {description}
        </Text>
      </VStack>
    </Box>
  );
}

export function LayoutPrimitivesPage() {
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
          Box / VStack / HStack / Text
        </Text>
        <Text textStyle="t4Regular" color="fg.neutralSubtle">
          @seed-design/lynx-react layout primitives
        </Text>
      </VStack>

      <SectionTitle>Box surfaces</SectionTitle>
      <VStack gap="x3">
        <Surface
          tone="brand"
          title="Token style props"
          description="bg, border, radius, padding shorthand are resolved to direct object styles."
        />
        <Box bg="bg.neutralWeak" borderRadius="r3" px="x4" py="x3">
          <HStack gap="x3" align="center" justify="spaceBetween">
            <VStack gap="x1" grow>
              <Text textStyle="t4Bold" color="fg.neutral">
                style prop merge
              </Text>
              <CodeLabel>style={`{{ paddingLeft: "28px" }}`}</CodeLabel>
            </VStack>
            <Box
              bg="bg.layerDefault"
              borderRadius="full"
              px="x3"
              py="x1"
              style={{ paddingLeft: '28px' } as React.CSSProperties}
            >
              <Text textStyle="t2Bold" color="fg.neutral">
                override
              </Text>
            </Box>
          </HStack>
        </Box>
      </VStack>

      <SectionTitle>VStack</SectionTitle>
      <VStack
        gap="x2"
        bg="bg.neutralWeak"
        borderRadius="r3"
        p="x3"
        align="stretch"
      >
        {['First item', 'Second item', 'Third item'].map((label) => (
          <Box key={label} bg="bg.layerDefault" borderRadius="r2" p="x3">
            <Text textStyle="t4Medium" color="fg.neutral">
              {label}
            </Text>
          </Box>
        ))}
      </VStack>

      <SectionTitle>HStack</SectionTitle>
      <VStack gap="x3">
        <HStack gap="x2" align="center" justify="spaceBetween">
          <Box bg="bg.brandWeak" borderRadius="r2" px="x3" py="x2">
            <Text textStyle="t3Bold" color="fg.brand">
              left
            </Text>
          </Box>
          <Box bg="bg.positiveWeak" borderRadius="r2" px="x3" py="x2">
            <Text textStyle="t3Bold" color="fg.positive">
              center
            </Text>
          </Box>
          <Box bg="bg.informativeWeak" borderRadius="r2" px="x3" py="x2">
            <Text textStyle="t3Bold" color="fg.informative">
              right
            </Text>
          </Box>
        </HStack>

        <HStack gap="x2" wrap>
          {['wrap', 'gap', 'align', 'justify', 'grow', 'shrink'].map(
            (label) => (
              <Box
                key={label}
                bg="bg.layerDefault"
                borderRadius="full"
                px="x3"
                py="x1"
              >
                <Text textStyle="t2Bold" color="fg.neutral">
                  {label}
                </Text>
              </Box>
            ),
          )}
        </HStack>
      </VStack>

      <SectionTitle>Text</SectionTitle>
      <VStack gap="x2">
        {TEXT_STYLES.map((textStyle) => (
          <Text key={textStyle} textStyle={textStyle} color="fg.neutral">
            {textStyle}
          </Text>
        ))}
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
            Tap to switch token values
          </Text>
          <Text textStyle="t3Regular" color="fg.neutralSubtle">
            Box and Text update token-derived object styles through React state.
          </Text>
        </VStack>
      </Box>

      <SectionTitle>Stress grid</SectionTitle>
      <VStack gap="x2">
        <Text textStyle="t3Regular" color="fg.neutralSubtle">
          72 Box/Text pairs rendered with nested VStack and HStack primitives.
        </Text>
        <HStack gap="x2" wrap>
          {STRESS_ITEMS.map((item) => {
            const variant = item % 4;
            const bg =
              variant === 0
                ? 'bg.brandWeak'
                : variant === 1
                  ? 'bg.positiveWeak'
                  : variant === 2
                    ? 'bg.informativeWeak'
                    : 'bg.neutralWeak';
            const color =
              variant === 0
                ? 'fg.brand'
                : variant === 1
                  ? 'fg.positive'
                  : variant === 2
                    ? 'fg.informative'
                    : 'fg.neutral';

            return (
              <Box
                key={item}
                bg={bg}
                borderRadius="r2"
                width="56px"
                height="56px"
                p="x2"
              >
                <VStack
                  gap="x0_5"
                  align="center"
                  justify="center"
                  style={{ height: '100%' }}
                >
                  <Text textStyle="t2Bold" color={color}>
                    {`#${item + 1}`}
                  </Text>
                  <Text textStyle="t1Regular" color="fg.neutralSubtle">
                    item
                  </Text>
                </VStack>
              </Box>
            );
          })}
        </HStack>
      </VStack>
    </VStack>
  );
}
