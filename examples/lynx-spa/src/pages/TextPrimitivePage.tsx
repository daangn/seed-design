import { useState } from '@lynx-js/react';
import { Box, HStack, Text, VStack } from '@seed-design/lynx-react';
import type * as React from 'react';

const TEXT_STYLES = [
  'screenTitle',
  't7Bold',
  't6Medium',
  't5Regular',
  't4Regular',
  't3Regular',
] as const;

const STATIC_TEXT_STYLES = [
  't3StaticRegular',
  't5StaticRegular',
  't5StaticBold',
  't7StaticBold',
  't9StaticBold',
] as const;

const FONT_SCALE_STEPS = [
  { label: '85%', scale: 0.85 },
  { label: '100%', scale: 1 },
  { label: '120%', scale: 1.2 },
  { label: '135%', scale: 1.35 },
] as const;

function SectionTitle({ children }: { children: string }) {
  return (
    <Text textStyle="t6Bold" color="fg.neutral" style={{ marginTop: '22px' }}>
      {children}
    </Text>
  );
}

function getScaledSp(base: number, scale: number) {
  return `${Math.round(base * scale)}sp`;
}

export function TextPrimitivePage() {
  const [accent, setAccent] = useState<'brand' | 'positive'>('brand');
  const [fontScaleIndex, setFontScaleIndex] = useState(1);
  const isBrand = accent === 'brand';
  const fontScale = FONT_SCALE_STEPS[fontScaleIndex];

  const scaledTokenStyle = {
    '--seed-font-size-t5': getScaledSp(16, fontScale.scale),
    '--seed-line-height-t5': getScaledSp(22, fontScale.scale),
    '--seed-font-size-t7': getScaledSp(20, fontScale.scale),
    '--seed-line-height-t7': getScaledSp(27, fontScale.scale),
  } as React.CSSProperties;

  function switchAccent() {
    'background only';
    setAccent(isBrand ? 'positive' : 'brand');
  }

  function scaleDown() {
    'background only';
    setFontScaleIndex((current) => Math.max(0, current - 1));
  }

  function resetScale() {
    'background only';
    setFontScaleIndex(1);
  }

  function scaleUp() {
    'background only';
    setFontScaleIndex((current) =>
      Math.min(FONT_SCALE_STEPS.length - 1, current + 1),
    );
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

      <SectionTitle>Static text styles</SectionTitle>
      <Box bg="bg.neutralWeak" borderRadius="r3" p="x3">
        <VStack gap="x2">
          {STATIC_TEXT_STYLES.map((textStyle) => (
            <Box key={textStyle} bg="bg.layerDefault" borderRadius="r2" p="x2">
              <Text textStyle={textStyle} color="fg.neutral">
                {`${textStyle} uses static px tokens`}
              </Text>
            </Box>
          ))}
        </VStack>
      </Box>

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
      </VStack>

      <SectionTitle>Alignment</SectionTitle>
      <Box bg="bg.neutralWeak" borderRadius="r3" p="x3">
        <VStack gap="x2">
          {(['left', 'center', 'right'] as const).map((align) => (
            <Box key={align} bg="bg.layerDefault" borderRadius="r2" p="x2">
              <Text
                textStyle="t3Bold"
                color="fg.neutral"
                align={align}
                style={{ width: '100%' } as React.CSSProperties}
              >
                {`align ${align}`}
              </Text>
            </Box>
          ))}
        </VStack>
      </Box>

      <SectionTitle>Font scaling</SectionTitle>
      <Box bg="bg.neutralWeak" borderRadius="r3" p="x3">
        <VStack gap="x3">
          <HStack gap="x2" align="center" justify="space-between">
            <Text textStyle="t3Bold" color="fg.neutral">
              {`scale ${fontScale.label}`}
            </Text>
            <HStack gap="x1">
              <Box
                bindtap={scaleDown}
                bg="bg.layerDefault"
                borderRadius="full"
                px="x3"
                py="x2"
              >
                <Text textStyle="t2Bold" color="fg.neutral">
                  -
                </Text>
              </Box>
              <Box
                bindtap={resetScale}
                bg="bg.layerDefault"
                borderRadius="full"
                px="x3"
                py="x2"
              >
                <Text textStyle="t2Bold" color="fg.neutral">
                  reset
                </Text>
              </Box>
              <Box
                bindtap={scaleUp}
                bg="bg.layerDefault"
                borderRadius="full"
                px="x3"
                py="x2"
              >
                <Text textStyle="t2Bold" color="fg.neutral">
                  +
                </Text>
              </Box>
            </HStack>
          </HStack>

          <Box
            bg="bg.layerDefault"
            borderRadius="r2"
            p="x3"
            style={scaledTokenStyle}
          >
            <VStack gap="x2">
              <Text textStyle="t5Regular" color="fg.neutral">
                Dynamic t5Regular follows overridden sp token values.
              </Text>
              <Text textStyle="t7Bold" color="fg.informative">
                Dynamic t7Bold should scale up and down.
              </Text>
              <Text textStyle="t5StaticRegular" color="fg.neutralSubtle">
                Static t5StaticRegular stays on static px token values.
              </Text>
              <Text textStyle="t7StaticBold" color="fg.neutralSubtle">
                Static t7StaticBold is the visual baseline.
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Box>

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
