import { useState } from "react";
import { HStack, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import {
  usePhoneNumberField,
  type UsePhoneNumberFieldOptions,
} from "seed-design/lib/phone-number-field";

const countries = {
  KR: { examples: ["01012345678", "+821012345678"] },
  JP: { examples: ["09001234567", "+819001234567"] },
  CA: { examples: ["4161234567", "+14161234567"] },
  US: { examples: ["2011234567", "+12011234567"] },
  GB: { examples: ["07123456789", "+447123456789"] },
} as const satisfies Readonly<
  Partial<Record<UsePhoneNumberFieldOptions["countryCode"], { examples: string[] }>>
>;

export default function TextFieldInputPhoneNumberFormatting() {
  const [countryCode, setCountryCode] = useState<keyof typeof countries>("KR");
  const phoneNumber = usePhoneNumberField({ countryCode });

  return (
    <VStack gap="spacingY.componentDefault">
      <RadioGroup
        label="국가"
        value={countryCode}
        onValueChange={(v) => {
          setCountryCode(v as typeof countryCode);
          phoneNumber.setValue("");
        }}
      >
        {Object.keys(countries).map((code) => (
          <RadioGroupItem tone="neutral" size="large" label={code} key={code} value={code} />
        ))}
      </RadioGroup>
      <TextField label="전화번호" {...phoneNumber.textFieldProps}>
        <TextFieldInput {...phoneNumber.inputProps} />
      </TextField>
      <HStack gap="x2" flexWrap="wrap">
        {countries[countryCode]?.examples.map((example) => (
          <ActionButton
            key={example}
            variant="neutralWeak"
            size="small"
            onClick={() => phoneNumber.setValue(example)}
          >
            {example}
          </ActionButton>
        ))}
      </HStack>
    </VStack>
  );
}
