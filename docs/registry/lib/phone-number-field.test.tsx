import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, mock } from "bun:test";
import React from "react";
import type { ReactElement } from "react";
import { TextField, TextFieldInput } from "../ui/text-field";
import { usePhoneNumberField, type UsePhoneNumberFieldOptions } from "./phone-number-field";

function PhoneField(props: UsePhoneNumberFieldOptions) {
  const { textFieldProps, inputProps } = usePhoneNumberField(props);
  return (
    <TextField label="Phone" {...textFieldProps}>
      <TextFieldInput data-testid="input" {...inputProps} />
    </TextField>
  );
}

function PhoneFieldWithSetValue({
  triggerValue,
  ...props
}: UsePhoneNumberFieldOptions & { triggerValue: string }) {
  const { textFieldProps, inputProps, setValue } = usePhoneNumberField(props);
  return (
    <>
      <TextField label="Phone" {...textFieldProps}>
        <TextFieldInput data-testid="input" {...inputProps} />
      </TextField>
      <button type="button" data-testid="set" onClick={() => setValue(triggerValue)} />
    </>
  );
}

function setup(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

describe("usePhoneNumberField", () => {
  describe("toNationalDigits (via setValue)", () => {
    it("KR, +8210... -> 010-1234-5678", async () => {
      const handleChange = mock<(v: string) => void>(() => {});
      const { user, getByTestId } = setup(
        <PhoneFieldWithSetValue
          countryCode="KR"
          triggerValue="+821012345678"
          onValueChange={handleChange}
        />,
      );
      await user.click(getByTestId("set"));
      expect(getByTestId("input")).toHaveValue("010-1234-5678");
      expect(handleChange).toHaveBeenLastCalledWith("01012345678");
    });

    it("CA, +1416... -> (416) 123-4567", async () => {
      const handleChange = mock<(v: string) => void>(() => {});
      const { user, getByTestId } = setup(
        <PhoneFieldWithSetValue
          countryCode="CA"
          triggerValue="+14161234567"
          onValueChange={handleChange}
        />,
      );
      await user.click(getByTestId("set"));
      expect(getByTestId("input")).toHaveValue("(416) 123-4567");
      expect(handleChange).toHaveBeenLastCalledWith("4161234567");
    });

    it("US, +1201... -> (201) 123-4567", async () => {
      const handleChange = mock<(v: string) => void>(() => {});
      const { user, getByTestId } = setup(
        <PhoneFieldWithSetValue
          countryCode="US"
          triggerValue="+12011234567"
          onValueChange={handleChange}
        />,
      );
      await user.click(getByTestId("set"));
      expect(getByTestId("input")).toHaveValue("(201) 123-4567");
      expect(handleChange).toHaveBeenLastCalledWith("2011234567");
    });

    it("GB, +4471... -> 07123 456789", async () => {
      const handleChange = mock<(v: string) => void>(() => {});
      const { user, getByTestId } = setup(
        <PhoneFieldWithSetValue
          countryCode="GB"
          triggerValue="+447123456789"
          onValueChange={handleChange}
        />,
      );
      await user.click(getByTestId("set"));
      expect(getByTestId("input")).toHaveValue("07123 456789");
      expect(handleChange).toHaveBeenLastCalledWith("07123456789");
    });

    it("KR, +1201... -> 1201...", async () => {
      const handleChange = mock<(v: string) => void>(() => {});
      const { user, getByTestId } = setup(
        <PhoneFieldWithSetValue
          countryCode="KR"
          triggerValue="+12011234567"
          onValueChange={handleChange}
        />,
      );
      await user.click(getByTestId("set"));
      expect(getByTestId("input")).toHaveValue("12011234567");
      expect(handleChange).toHaveBeenLastCalledWith("12011234567");
    });

    it("KR, 010... -> 010-1234-5678", async () => {
      const handleChange = mock<(v: string) => void>(() => {});
      const { user, getByTestId } = setup(
        <PhoneFieldWithSetValue
          countryCode="KR"
          triggerValue="01012345678"
          onValueChange={handleChange}
        />,
      );
      await user.click(getByTestId("set"));
      expect(getByTestId("input")).toHaveValue("010-1234-5678");
      expect(handleChange).toHaveBeenLastCalledWith("01012345678");
    });

    it("empty -> empty", async () => {
      const handleChange = mock<(v: string) => void>(() => {});
      const { user, getByTestId } = setup(
        <PhoneFieldWithSetValue countryCode="KR" triggerValue="" onValueChange={handleChange} />,
      );
      await user.click(getByTestId("set"));
      expect(getByTestId("input")).toHaveValue("");
      expect(handleChange).toHaveBeenLastCalledWith("");
    });

    it("+unknown123 -> strips +", async () => {
      const handleChange = mock<(v: string) => void>(() => {});
      const { user, getByTestId } = setup(
        <PhoneFieldWithSetValue
          countryCode="KR"
          triggerValue="+unknown123"
          onValueChange={handleChange}
        />,
      );
      await user.click(getByTestId("set"));
      expect(handleChange.mock.lastCall?.[0]).not.toContain("+");
    });
  });

  describe("typing & backspace", () => {
    it("KR, 01012345678 -> 010-1234-5678", async () => {
      const { user, getByTestId } = setup(<PhoneField countryCode="KR" />);
      await user.type(getByTestId("input"), "01012345678");
      expect(getByTestId("input")).toHaveValue("010-1234-5678");
    });

    it("US, 2011234567 -> (201) 123-4567", async () => {
      const { user, getByTestId } = setup(<PhoneField countryCode="US" />);
      await user.type(getByTestId("input"), "2011234567");
      expect(getByTestId("input")).toHaveValue("(201) 123-4567");
    });

    it("KR, backspace removes last digit", async () => {
      const handleChange = mock<(v: string) => void>(() => {});
      const { user, getByTestId } = setup(
        <PhoneField countryCode="KR" onValueChange={handleChange} />,
      );
      const input = getByTestId("input");
      await user.type(input, "0101234");
      expect(input).toHaveValue("010-1234");
      await user.keyboard("{Backspace}");
      expect(input).toHaveValue("010-123");
      expect(handleChange).toHaveBeenLastCalledWith("010123");
    });

    it("US, backspace after formatting char removes digit", async () => {
      const handleChange = mock<(v: string) => void>(() => {});
      const { user, getByTestId } = setup(
        <PhoneField countryCode="US" onValueChange={handleChange} />,
      );
      const input = getByTestId("input");
      await user.type(input, "2011");
      expect(input).toHaveValue("(201) 1");
      await user.keyboard("{Backspace}");
      expect(input).toHaveValue("(201)");
      expect(handleChange).toHaveBeenLastCalledWith("201");
    });

    it("raw digits extracted from formatted input", async () => {
      const handleChange = mock<(v: string) => void>(() => {});
      const { user, getByTestId } = setup(
        <PhoneField countryCode="US" onValueChange={handleChange} />,
      );
      await user.type(getByTestId("input"), "2011234567");
      expect(handleChange).toHaveBeenLastCalledWith("2011234567");
    });

    it("empty field returns empty string", () => {
      const { getByTestId } = setup(<PhoneField countryCode="KR" />);
      expect(getByTestId("input")).toHaveValue("");
    });

    it("formatted value never contains +", async () => {
      const { user, getByTestId } = setup(
        <PhoneFieldWithSetValue countryCode="KR" triggerValue="+821012345678" />,
      );
      await user.click(getByTestId("set"));
      expect(getByTestId("input")).toHaveValue("010-1234-5678");
    });
  });

  describe("controlled / uncontrolled", () => {
    it("uncontrolled: manages internal state", async () => {
      const { user, getByTestId } = setup(<PhoneField countryCode="KR" />);
      const input = getByTestId("input");
      expect(input).toHaveValue("");
      await user.type(input, "01012345678");
      expect(input).toHaveValue("010-1234-5678");
    });

    it("controlled: updates via onValueChange", async () => {
      function Controlled() {
        const [value, setValue] = React.useState("");
        const { textFieldProps, inputProps } = usePhoneNumberField({
          countryCode: "KR",
          value,
          onValueChange: setValue,
        });
        return (
          <TextField label="Phone" {...textFieldProps}>
            <TextFieldInput data-testid="input" {...inputProps} />
          </TextField>
        );
      }
      const { user, getByTestId } = setup(<Controlled />);
      await user.type(getByTestId("input"), "01012345678");
      expect(getByTestId("input")).toHaveValue("010-1234-5678");
    });

    it("controlled without onValueChange: value stays fixed", async () => {
      const { user, getByTestId } = setup(<PhoneField countryCode="KR" value="" />);
      await user.type(getByTestId("input"), "010");
      expect(getByTestId("input")).toHaveValue("");
    });

    it("uncontrolled: onValueChange still fires", async () => {
      const handleChange = mock<(v: string) => void>(() => {});
      const { user, getByTestId } = setup(
        <PhoneField countryCode="KR" onValueChange={handleChange} />,
      );
      await user.type(getByTestId("input"), "01012345678");
      expect(handleChange).toHaveBeenLastCalledWith("01012345678");
      expect(getByTestId("input")).toHaveValue("010-1234-5678");
    });
  });

  describe("inputProps", () => {
    it("inputMode=tel, autoComplete=tel", () => {
      const { getByTestId } = setup(<PhoneField countryCode="KR" />);
      const input = getByTestId("input");
      expect(input).toHaveAttribute("inputmode", "tel");
      expect(input).toHaveAttribute("autocomplete", "tel");
    });

    it("country default placeholder", () => {
      const { getByTestId } = setup(<PhoneField countryCode="KR" />);
      expect(getByTestId("input")).toHaveAttribute("placeholder", "010-1234-5678");
    });

    it("explicit placeholder overrides default", () => {
      const { getByTestId } = setup(<PhoneField countryCode="KR" placeholder="커스텀" />);
      expect(getByTestId("input")).toHaveAttribute("placeholder", "커스텀");
    });

    it('placeholder="" overrides default', () => {
      const { getByTestId } = setup(<PhoneField countryCode="KR" placeholder="" />);
      expect(getByTestId("input")).toHaveAttribute("placeholder", "");
    });
  });

  describe("country without COUNTRY_DEFAULTS", () => {
    it("DE, no default placeholder", () => {
      const { getByTestId } = setup(<PhoneField countryCode="DE" />);
      expect(getByTestId("input").getAttribute("placeholder")).toBeNull();
    });

    it("DE, typing still formats", async () => {
      const handleChange = mock<(v: string) => void>(() => {});
      const { user, getByTestId } = setup(
        <PhoneField countryCode="DE" onValueChange={handleChange} />,
      );
      await user.type(getByTestId("input"), "03012345678");
      expect(getByTestId("input")).toHaveValue("030 12345678");
      expect(handleChange).toHaveBeenLastCalledWith("03012345678");
    });
  });
});
