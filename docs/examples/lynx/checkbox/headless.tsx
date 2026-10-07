import { useState } from "@lynx-js/react";
import { Checkbox, useCheckboxContext } from "@seed-design/lynx-react-checkbox";

function Box() {
  const { checked, indeterminate, pressed } = useCheckboxContext();
  const selected = checked || indeterminate;

  return (
    <Checkbox.Control
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "22px",
        height: "22px",
        borderRadius: "6px",
        borderWidth: "2px",
        borderStyle: "solid",
        borderColor: selected
          ? "var(--seed-color-bg-neutral-solid)"
          : "var(--seed-color-stroke-neutral-weak)",
        backgroundColor: selected
          ? pressed
            ? "var(--seed-color-bg-neutral-solid-pressed)"
            : "var(--seed-color-bg-neutral-solid)"
          : pressed
            ? "var(--seed-color-bg-neutral-weak-pressed)"
            : "transparent",
      }}
    >
      {selected ? (
        <text
          style={{
            color: "var(--seed-color-fg-on-neutral-solid)",
            fontSize: "14px",
            fontWeight: "700",
          }}
        >
          {indeterminate ? "−" : "✓"}
        </text>
      ) : null}
    </Checkbox.Control>
  );
}

interface ItemProps {
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function Item({ label, checked, indeterminate, onCheckedChange }: ItemProps) {
  return (
    <Checkbox.Root
      checked={checked}
      indeterminate={indeterminate}
      onCheckedChange={onCheckedChange}
      accessibility-label={label}
      style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "8px 0" }}
    >
      <Box />
      <text
        style={{
          marginLeft: "8px",
          fontSize: "16px",
          color: "var(--seed-color-fg-neutral)",
        }}
      >
        {label}
      </text>
    </Checkbox.Root>
  );
}

export default function Example() {
  const [agreements, setAgreements] = useState({ terms: true, marketing: false });
  const allChecked = agreements.terms && agreements.marketing;
  const someChecked = agreements.terms || agreements.marketing;

  function handleAllChange(checked: boolean) {
    "background only";
    setAgreements({ terms: checked, marketing: checked });
  }

  function handleTermsChange(checked: boolean) {
    "background only";
    setAgreements((prev) => ({ ...prev, terms: checked }));
  }

  function handleMarketingChange(checked: boolean) {
    "background only";
    setAgreements((prev) => ({ ...prev, marketing: checked }));
  }

  return (
    <view
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "360px",
        gap: "8px",
      }}
    >
      <Item
        label="전체 동의"
        checked={allChecked}
        indeterminate={someChecked && !allChecked}
        onCheckedChange={handleAllChange}
      />
      <view style={{ display: "flex", flexDirection: "column", gap: "8px", paddingLeft: "30px" }}>
        <Item
          label="이용약관 동의"
          checked={agreements.terms}
          onCheckedChange={handleTermsChange}
        />
        <Item
          label="마케팅 정보 수신 동의"
          checked={agreements.marketing}
          onCheckedChange={handleMarketingChange}
        />
      </view>
    </view>
  );
}
