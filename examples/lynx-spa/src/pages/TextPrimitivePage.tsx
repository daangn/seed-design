import { useState } from "@lynx-js/react";
import { Box, Text, VStack } from "@seed-design/lynx-react";

const TEXT_STYLES = [
  "screenTitle",
  "t7Bold",
  "t6Medium",
  "t5Regular",
  "t4Regular",
  "t3Regular",
] as const;

const STATIC_TEXT_STYLES = [
  "t3StaticRegular",
  "t5StaticRegular",
  "t5StaticBold",
  "t7StaticBold",
  "t9StaticBold",
] as const;

function SectionTitle({ children }: { children: string }) {
  return (
    <Text textStyle="t6Bold" color="fg.neutral" className="mt-[22px]">
      {children}
    </Text>
  );
}

export function TextPrimitivePage() {
  const [accent, setAccent] = useState<"brand" | "positive">("brand");
  const isBrand = accent === "brand";

  function switchAccent() {
    "background only";
    setAccent(isBrand ? "positive" : "brand");
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
        <Text fontSize="t7" lineHeight="t7" fontWeight="bold" color="fg.informative">
          fontSize / lineHeight / fontWeight overrides
        </Text>
      </VStack>

      <SectionTitle>Alignment</SectionTitle>
      <Box bg="bg.neutralWeak" borderRadius="r3" p="x3">
        <VStack gap="x2">
          {(["left", "center", "right"] as const).map((align) => (
            <Box key={align} bg="bg.layerDefault" borderRadius="r2" p="x2">
              <Text textStyle="t3Bold" color="fg.neutral" align={align} className="w-full">
                {`align ${align}`}
              </Text>
            </Box>
          ))}
        </VStack>
      </Box>

      <SectionTitle>Device font scale comparison</SectionTitle>
      <Box bg="bg.neutralWeak" borderRadius="r3" p="x3">
        <VStack gap="x2">
          <Box bg="bg.layerDefault" borderRadius="r2" p="x3">
            <VStack gap="x1">
              <Text textStyle="t2Bold" color="fg.informative">
                Dynamic text styles
              </Text>
              <Text textStyle="t5Regular" color="fg.neutral">
                t5Regular uses sp tokens and should follow device font scale.
              </Text>
              <Text textStyle="t7Bold" color="fg.informative">
                t7Bold uses sp tokens and should grow with device font scale.
              </Text>
            </VStack>
          </Box>

          <Box bg="bg.layerDefault" borderRadius="r2" p="x3">
            <VStack gap="x1">
              <Text textStyle="t2Bold" color="fg.neutralSubtle">
                Static text styles
              </Text>
              <Text textStyle="t5StaticRegular" color="fg.neutralSubtle">
                t5StaticRegular uses px tokens and should stay stable.
              </Text>
              <Text textStyle="t7StaticBold" color="fg.neutralSubtle">
                t7StaticBold uses px tokens and should stay stable.
              </Text>
            </VStack>
          </Box>

          <Box bg="bg.layerDefault" borderRadius="r2" p="x3">
            <Text textStyle="t3Regular" color="fg.neutralSubtle">
              Change the mobile device font-size setting and compare this page again.
            </Text>
          </Box>
        </VStack>
      </Box>

      <SectionTitle>Dynamic token values</SectionTitle>
      <Box
        bindtap={switchAccent}
        bg={isBrand ? "bg.brandWeak" : "bg.positiveWeak"}
        borderColor={isBrand ? "stroke.brandWeak" : "stroke.positiveWeak"}
        borderWidth={1}
        borderRadius="r3"
        p="x4"
      >
        <VStack gap="x1">
          <Text textStyle="t5Bold" color={isBrand ? "fg.brand" : "fg.positive"}>
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
