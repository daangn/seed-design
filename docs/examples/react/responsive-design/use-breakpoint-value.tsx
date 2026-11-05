import { ActionButton, ActionButtonProps } from "seed-design/ui/action-button";
import { useBreakpointValue, VStack, Text } from "@seed-design/react";

export default function UseBreakpointValueExample() {
  const actionButtonProps = useBreakpointValue<ActionButtonProps>({
    base: {
      variant: "neutralWeak",
      children: "variant=neutralWeak",
    },
    lg: {
      variant: "brandSolid",
      children: "variant=brandSolid",
    },
  });

  return (
    <VStack gap="x2" align="center">
      <Text textStyle="t3Medium">아래 ActionButton은 lg breakpoint에서 variant가 변경됩니다.</Text>
      <ActionButton {...actionButtonProps} />
    </VStack>
  );
}
