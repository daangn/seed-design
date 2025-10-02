import { VStack, Text } from "@seed-design/react";
import type { ActivityComponentType } from "@stackflow/react";
import * as React from "react";
import { AppBar, AppBarBackButton, AppBarMain } from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";
import { NumberField } from "../seed-design/ui/number-field";
import { ListHeader } from "../seed-design/ui/list-header";

const ActivityNumberField: ActivityComponentType = () => {
  const [basicValue, setBasicValue] = React.useState<number | undefined>(0);
  const [rangeValue, setRangeValue] = React.useState<number | undefined>(50);
  const [stepValue, setStepValue] = React.useState<number | undefined>(0);
  const [decimalValue, setDecimalValue] = React.useState<number | undefined>(0);

  return (
    <AppScreen>
      <AppBar>
        <AppBarBackButton />
        <AppBarMain title="NumberField" />
      </AppBar>
      <AppScreenContent>
        <VStack gap="spacingY.componentDefault" padding="x4">
          {/* Basic */}
          <VStack gap="x2">
            <ListHeader>Basic</ListHeader>
            <NumberField value={basicValue} onValueChange={setBasicValue} min={0} max={120} />
            <Text>Current value: {basicValue ?? "undefined"}</Text>
          </VStack>

          {/* Range with min/max */}
          <VStack gap="x2">
            <ListHeader>Range (0-100)</ListHeader>
            <NumberField
              value={rangeValue}
              onValueChange={setRangeValue}
              min={0}
              max={100}
              step={5}
            />
            <Text>Current value: {rangeValue ?? "undefined"}</Text>
          </VStack>

          {/* Custom step */}
          <VStack gap="x2">
            <ListHeader>Custom Step (10)</ListHeader>
            <NumberField value={stepValue} onValueChange={setStepValue} step={10} min={0} />
            <Text>Current value: {stepValue ?? "undefined"}</Text>
          </VStack>

          {/* Decimal */}
          <VStack gap="x2">
            <ListHeader>Decimal (0.1 step)</ListHeader>
            <NumberField
              value={decimalValue}
              onValueChange={setDecimalValue}
              step={0.1}
              min={0}
              formatOptions={{ minimumFractionDigits: 1, maximumFractionDigits: 2 }}
            />
            <Text>Current value: {decimalValue ?? "undefined"}</Text>
          </VStack>

          {/* Disabled */}
          <VStack gap="x2">
            <ListHeader>Disabled</ListHeader>
            <NumberField disabled value={42} />
          </VStack>

          {/* ReadOnly */}
          <VStack gap="x2">
            <ListHeader>ReadOnly</ListHeader>
            <NumberField readOnly value={99} />
          </VStack>

          {/* Locale formatting */}
          <VStack gap="x2">
            <ListHeader>Korean Locale</ListHeader>
            <NumberField locale="ko-KR" min={0} />
          </VStack>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityNumberField;
