import { VStack } from "@seed-design/react";
import { Callout, DismissibleCallout } from "seed-design/ui/callout";

export default function CalloutLinkLabelAsChild() {
  return (
    <VStack gap="x4" width="full">
      <Callout
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
        linkProps={{
          asChild: true,
          children: (
            <a href="https://www.daangn.com" target="_blank" rel="noreferrer">
              시도해 보기
            </a>
          ),
        }}
      />
      <DismissibleCallout
        description="기능에 대한 안내 또는 유익한 내용을 전달해요. 콜아웃은 꼭 필요한 경우에만 절제하여 사용해요."
        linkProps={{
          asChild: true,
          children: (
            <a href="https://www.daangn.com" target="_blank" rel="noreferrer">
              시도해 보기
            </a>
          ),
        }}
      />
    </VStack>
  );
}
