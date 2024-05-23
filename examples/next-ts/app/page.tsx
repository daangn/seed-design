import { BoxButton } from "@/design-system/components/BoxButton";
import { Flex } from "@/design-system/components/Flex";
import { Text } from "@/design-system/components/Text";
import "@seed-design/stylesheet/boxButton.css";

export default function Home() {
  return (
    <main>
      <Flex
        flexDirection="column"
        alignItems="flexStart"
        gap={3}
        padding={5}
        backgroundColor="layer1"
      >
        <Text size="medium" color="neutral" weight="strong">
          나는너무슬퍼
        </Text>
        <Flex alignItems="center" gap={2.5}>
          <BoxButton size="xsmall" variant="brand">
            xsmall
          </BoxButton>
          <BoxButton size="medium" variant="brand">
            medium
          </BoxButton>
          <BoxButton size="medium" variant="brand">
            brand
          </BoxButton>
          <BoxButton size="medium" variant="neutral">
            neutral
          </BoxButton>
        </Flex>
        <Flex flexDirection="column" alignItems="flexStart" gap={2.5}>
          <BoxButton size="xsmall" variant="brand">
            xsmall
          </BoxButton>
          <BoxButton size="medium" variant="brand">
            medium
          </BoxButton>
          <BoxButton size="medium" variant="brand">
            brand
          </BoxButton>
          <BoxButton size="medium" variant="neutral">
            neutral
          </BoxButton>
        </Flex>
      </Flex>
    </main>
  );
}
