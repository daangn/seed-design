import { Text, VStack } from "@seed-design/lynx-react";

export function LayoutTextPage() {
  return (
    <scroll-view scroll-y style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
      <text style={{ fontSize: "20px", fontWeight: "bold" }}>Text</text>

      <text style={{ fontSize: "16px", fontWeight: "bold" }}>Dynamic Text Styles (sp)</text>
      <text style={{ fontSize: "11px", color: "#999", marginBottom: "4px" }}>
        시스템 폰트 크기 설정에 반응합니다
      </text>
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

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Static Text Styles (px)</text>
      <text style={{ fontSize: "11px", color: "#999", marginBottom: "4px" }}>
        시스템 폰트 크기 설정에 반응하지 않습니다
      </text>
      <VStack gap="x1">
        <Text color="fg.neutral" textStyle="t1StaticRegular">t1StaticRegular</Text>
        <Text color="fg.neutral" textStyle="t3StaticRegular">t3StaticRegular</Text>
        <Text color="fg.neutral" textStyle="t5StaticRegular">t5StaticRegular</Text>
        <Text color="fg.neutral" textStyle="t7StaticBold">t7StaticBold</Text>
        <Text color="fg.neutral" textStyle="t10StaticBold">t10StaticBold</Text>
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

      <text style={{ fontSize: "16px", fontWeight: "bold", marginTop: "8px" }}>Alignment</text>
      <VStack gap="x1">
        <Text color="fg.neutral" textStyle="t5Regular" align="left">Left aligned</Text>
        <Text color="fg.neutral" textStyle="t5Regular" align="center">Center aligned</Text>
        <Text color="fg.neutral" textStyle="t5Regular" align="right">Right aligned</Text>
      </VStack>
    </scroll-view>
  );
}
