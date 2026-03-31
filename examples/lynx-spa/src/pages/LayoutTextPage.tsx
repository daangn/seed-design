import { Text, VStack } from "@seed-design/lynx-react";

export function LayoutTextPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>Text</text>

      <text style={{ fontSize: "16px", fontWeight: "bold" }}>Text Styles</text>
      <VStack gap="x1">
        <Text color="fg.neutral" textStyle="t1Regular">t1Regular</Text>
        <Text color="fg.neutral" textStyle="t2Regular">t2Regular</Text>
        <Text color="fg.neutral" textStyle="t3Regular">t3Regular</Text>
        <Text color="fg.neutral" textStyle="t4Regular">t4Regular</Text>
        <Text color="fg.neutral" textStyle="t5Regular">t5Regular</Text>
        <Text color="fg.neutral" textStyle="t6Bold">t6Bold</Text>
        <Text color="fg.neutral" textStyle="t7Bold">t7Bold</Text>
        <Text color="fg.neutral" textStyle="t8Bold">t8Bold</Text>
        <Text color="fg.neutral" textStyle="t9Bold">t9Bold</Text>
        <Text color="fg.neutral" textStyle="t10Bold">t10Bold</Text>
      </VStack>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Colors</text>
      <VStack gap="x1">
        <Text color="fg.neutral" textStyle="t5Regular">fg.neutral</Text>
        <Text color="fg.neutralSubtle" textStyle="t5Regular">fg.neutralSubtle</Text>
        <Text color="fg.brand" textStyle="t5Regular">fg.brand</Text>
        <Text color="fg.critical" textStyle="t5Regular">fg.critical</Text>
        <Text color="fg.success" textStyle="t5Regular">fg.success</Text>
      </VStack>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Font Weights</text>
      <VStack gap="x1">
        <Text color="fg.neutral" textStyle="t5Regular" fontWeight="regular">Regular</Text>
        <Text color="fg.neutral" textStyle="t5Regular" fontWeight="medium">Medium</Text>
        <Text color="fg.neutral" textStyle="t5Regular" fontWeight="bold">Bold</Text>
      </VStack>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Max Lines</text>
      <VStack gap="x2">
        <Text color="fg.neutral" textStyle="t5Regular" maxLines={1}>
          이 텍스트는 한 줄로 제한됩니다. 텍스트가 길어지면 말줄임표로 표시됩니다. 이 문장은 한 줄을 넘어가도록 충분히 길게 작성되었습니다.
        </Text>
        <Text color="fg.neutral" textStyle="t5Regular" maxLines={2}>
          이 텍스트는 두 줄로 제한됩니다. 텍스트가 길어지면 말줄임표로 표시됩니다. 이 문장은 두 줄을 넘어가도록 충분히 길게 작성되었습니다. 추가 텍스트를 넣어 줄 수를 초과하게 만듭니다.
        </Text>
      </VStack>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Alignment</text>
      <VStack gap="x1">
        <Text color="fg.neutral" textStyle="t5Regular" align="left">Left aligned</Text>
        <Text color="fg.neutral" textStyle="t5Regular" align="center">Center aligned</Text>
        <Text color="fg.neutral" textStyle="t5Regular" align="right">Right aligned</Text>
      </VStack>

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Static Text Styles</text>
      <VStack gap="x1">
        <Text color="fg.neutral" textStyle="t3StaticRegular">t3StaticRegular</Text>
        <Text color="fg.neutral" textStyle="t5StaticMedium">t5StaticMedium</Text>
        <Text color="fg.neutral" textStyle="t7StaticBold">t7StaticBold</Text>
      </VStack>
    </scroll-view>
  );
}
