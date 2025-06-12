import OTPInput from "react-otp-input";
import { Input } from "./input";

interface IOtpInputProps {
  value: string;
  setValue: (value: string) => void;
  isError?: boolean;
  disabled?: boolean;
}

export const Otp = (props: IOtpInputProps) => {
  return (
    <OTPInput
      value={props.value}
      onChange={props.setValue}
      numInputs={6}
      shouldAutoFocus
      containerStyle="grid gap-3 justify-center sm:gap-6"
      inputType="number"
      renderInput={(inputProps) => (
        <Input
          {...inputProps}
          disabled={props.disabled}
          placeholder="-"
          autoComplete="one-time-code"
          inputMode="numeric"
          maxLength={1}
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "-")}
          className={`otp-input h-10 min-w-[40px] appearance-none p-0 text-white ${props.isError && "border-red-600 text-red-600"}`}
        />
      )}
    />
  );
};
