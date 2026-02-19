import { useMemo, useState } from "react";
import {
  formatIncompletePhoneNumber,
  getCountryCallingCode,
  parseIncompletePhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import type { TextFieldProps, TextFieldInputProps } from "../ui/text-field";

const COUNTRY_DEFAULTS: Partial<
  Record<CountryCode, { textFieldProps?: TextFieldProps; inputProps?: TextFieldInputProps }>
> = {
  KR: { inputProps: { placeholder: "010-1234-5678" } },
  JP: { inputProps: { placeholder: "090-0123-4567" } },
  CA: { inputProps: { placeholder: "(416) 123-4567" } },
  US: { inputProps: { placeholder: "(201) 123-4567" } },
  GB: { inputProps: { placeholder: "07123 456789" } },
};

function toNationalDigits(input: string, country: CountryCode): string {
  const cleaned = parseIncompletePhoneNumber(input);
  if (cleaned === "" || !cleaned.startsWith("+")) return cleaned;

  const parsed = parsePhoneNumberFromString(cleaned, country);
  if (parsed && parsed.countryCallingCode === getCountryCallingCode(country)) {
    return parseIncompletePhoneNumber(parsed.formatNational());
  }

  return cleaned.replace(/^\+/, "");
}

export interface UsePhoneNumberFieldOptions {
  countryCode: CountryCode;
  placeholder?: string;

  value?: string;
  onValueChange?: (value: string) => void;
}

export function usePhoneNumberField({
  countryCode,
  placeholder,
  value: propValue,
  onValueChange,
}: UsePhoneNumberFieldOptions) {
  const [internalValue, setInternalValue] = useState("");
  const value = propValue ?? internalValue;

  const setValueRaw = (value: string) => {
    if (propValue === undefined) setInternalValue(value);

    onValueChange?.(value);
  };

  const setValue = (value: string) => {
    setValueRaw(toNationalDigits(value, countryCode));
  };

  const formattedValue = useMemo(() => {
    if (value === "") return value;

    return formatIncompletePhoneNumber(value, countryCode);
  }, [value, countryCode]);

  const handleValueChange = ({ value: newValue }: { value: string }) => {
    const raw = parseIncompletePhoneNumber(newValue);

    if (raw.startsWith("+")) {
      setValueRaw(toNationalDigits(raw, countryCode));

      return;
    }

    if (raw === value && raw.length > 0 && newValue.length < formattedValue.length) {
      setValueRaw(raw.slice(0, -1));

      return;
    }

    setValueRaw(raw);
  };

  return {
    value,
    setValue,
    textFieldProps: {
      value: formattedValue,
      onValueChange: handleValueChange,
      ...COUNTRY_DEFAULTS[countryCode]?.textFieldProps,
    } satisfies TextFieldProps,
    inputProps: {
      inputMode: "tel",
      autoComplete: "tel",
      ...COUNTRY_DEFAULTS[countryCode]?.inputProps,
      ...(placeholder != null && { placeholder }),
    } satisfies TextFieldInputProps,
  };
}
