import { radioVariantMap } from "@seed-design/lynx-css/recipes/radio";
import { radiomarkVariantMap } from "@seed-design/lynx-css/recipes/radiomark";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import {
  definePreviewStates,
  defineVariantAxes,
  type SetVariantValue,
  VariantCatalog,
  type VariantCatalogValues,
} from "../components/variant-catalog.jsx";
import { RadioGroup, RadioGroupItem } from "../seed-design/ui/radio-group";

const variants = defineVariantAxes([
  {
    key: "weight",
    options: radioVariantMap.weight,
    defaultValue: "regular",
  },
  {
    key: "size",
    options: radioVariantMap.size,
    defaultValue: "medium",
  },
  {
    key: "tone",
    options: radiomarkVariantMap.tone,
    defaultValue: "brand",
  },
  {
    key: "disabled",
    options: radioVariantMap.disabled,
    defaultValue: false,
  },
]);

const previewStates = definePreviewStates([{ key: "value", defaultValue: "option1" }]);

type RadioGroupValues = VariantCatalogValues<typeof variants, typeof previewStates>;

function renderRadioGroup(values: RadioGroupValues, setValue: SetVariantValue<RadioGroupValues>) {
  return (
    <RadioGroup
      weight={values.weight}
      size={values.size}
      tone={values.tone}
      disabled={Boolean(values.disabled)}
      value={values.value}
      onValueChange={(next) => setValue("value", next)}
    >
      {["option1", "option2", "option3"].map((value) => (
        <RadioGroupItem key={value} value={value} label={`Option ${value.replace("option", "")}`} />
      ))}
    </RadioGroup>
  );
}

function RadioGroupExamples() {
  return (
    <CatalogExamples title="RadioGroup" gap="12px">
      <CatalogSectionTitle>With Label</CatalogSectionTitle>
      <RadioGroup defaultValue="option2">
        {["option1", "option2", "option3"].map((value) => (
          <RadioGroupItem
            key={value}
            value={value}
            label={`Option ${value.replace("option", "")}`}
          />
        ))}
      </RadioGroup>

      <CatalogSectionTitle>Long Label</CatalogSectionTitle>
      <view className="w-[220px]">
        <RadioGroup defaultValue="option2">
          <RadioGroupItem value="option1" label="Option with a short label" />
          <RadioGroupItem
            value="option2"
            label="Option with a long label that wraps across multiple lines"
          />
          <RadioGroupItem
            value="option3"
            label="Another option with enough text to verify alignment"
          />
        </RadioGroup>
      </view>
    </CatalogExamples>
  );
}

export function RadioGroupPage() {
  return (
    <VariantCatalog
      variants={variants}
      previewStates={previewStates}
      examples={<RadioGroupExamples />}
    >
      {(values, setValue) => renderRadioGroup(values, setValue)}
    </VariantCatalog>
  );
}
