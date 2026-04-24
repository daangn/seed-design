import type { StaticActivityComponentType } from "@stackflow/react/future";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { useFlow } from "@stackflow/react/future";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "seed-design/ui/accordion";
import { Box, HStack, Text, VStack } from "@seed-design/react";
import type { ComponentProps } from "react";

declare module "@stackflow/config" {
  interface Register {
    ActivityAccordion: {};
  }
}

const FAQ_ITEMS = [
  {
    value: "service",
    title: "당근마켓은 어떤 서비스인가요?",
    content:
      "당근마켓은 동네 이웃 간의 중고거래를 돕는 플랫폼입니다. 가까운 이웃과 직거래로 안전하게 거래할 수 있어요.",
  },
  {
    value: "safety",
    title: "안전하게 거래하는 방법이 있나요?",
    description: "직거래 안전 가이드",
    content:
      "공공장소에서 만나거나 안전거래 서비스를 이용해 보세요. 상품을 직접 확인하고 거래하는 것을 권장합니다.",
  },
  {
    value: "manner-temp",
    title: "매너온도는 무엇인가요?",
    content:
      "매너온도는 당근마켓 회원들의 거래 매너를 수치화한 지표입니다. 좋은 거래 경험을 쌓을수록 온도가 올라갑니다.",
  },
];

interface AccordionSectionProps {
  title: string;
  description: string;
  variant: NonNullable<ComponentProps<typeof Accordion>["variant"]>;
  accordionProps?: Omit<ComponentProps<typeof Accordion>, "children" | "variant">;
}

function AccordionSection(props: AccordionSectionProps) {
  const { title, description, variant, accordionProps } = props;

  return (
    <Box bg="bg.layerDefault" borderRadius="r3" borderWidth={1} borderColor="stroke.neutralWeak">
      <VStack gap="x4" p="x4" align="stretch">
        <HStack gap="x3" align="flex-start" justify="space-between">
          <VStack gap="x1" align="stretch">
            <Text as="h2" textStyle="t5Bold" color="fg.neutral">
              {title}
            </Text>
            <Text as="p" textStyle="t3Regular" color="fg.neutralMuted">
              {description}
            </Text>
          </VStack>
          <Box px="x2" py="x1" borderRadius="r2" bg="bg.layerBasement">
            <Text textStyle="t2Bold" color="fg.neutralMuted">
              {variant}
            </Text>
          </Box>
        </HStack>

        <Accordion variant={variant} {...accordionProps}>
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger title={item.title} description={item.description} />
              <AccordionContent>
                <Box p="x4">
                  <Text as="p" textStyle="t4Regular" color="fg.neutralMuted">
                    {item.content}
                  </Text>
                </Box>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </VStack>
    </Box>
  );
}

const ActivityAccordion: StaticActivityComponentType<"ActivityAccordion"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Accordion</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack p="x4" gap="x5" align="stretch">
          <AccordionSection
            title="Inline"
            description="여러 항목을 동시에 열 수 있는 기본 accordion 예시입니다."
            variant="inline"
          />
          <AccordionSection
            title="Separated"
            description="카드형 항목을 하나씩 열고 닫는 accordion 예시입니다."
            variant="separated"
            accordionProps={{ type: "single", collapsible: true }}
          />
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityAccordion;
