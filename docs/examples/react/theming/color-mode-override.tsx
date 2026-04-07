import { ActionButton } from "seed-design/ui/action-button";
import { actionButtonVariantMap } from "@ride-developer/css/recipes/action-button";
import { Text, VStack } from "@ride-developer/react";

function Demo() {
  return (
    <>
      {actionButtonVariantMap.variant.map((variant) => (
        <ActionButton key={variant} variant={variant}>
          {variant}
        </ActionButton>
      ))}
    </>
  );
}

export default function ThemingColorModeOverride() {
  return (
    <div className="grid grid-cols-2 size-full">
      <VStack
        data-ride-color-mode="light-only"
        bg="bg.layerDefault"
        alignItems="center"
        justify="center"
        gap="spacingY.componentDefault"
        p="x6"
      >
        <Text color="fg.neutral" textStyle="t4Bold">
          라이트 모드
        </Text>
        <Demo />
      </VStack>
      <VStack
        data-ride-color-mode="dark-only"
        bg="bg.layerDefault"
        alignItems="center"
        justify="center"
        gap="spacingY.componentDefault"
        p="x6"
      >
        <Text color="fg.neutral" textStyle="t4Bold">
          다크 모드
        </Text>
        <Demo />
      </VStack>
    </div>
  );
}
