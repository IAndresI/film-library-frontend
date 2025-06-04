import * as React from "react";
import { cn } from "@/shared/lib/helpers";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { useState } from "react";
import { Otp } from "@/shared/ui/otp-input";
import { useSendOTP, useVerifyOTP } from "../lib/hooks";

const getInitialOtpData = () => {
  const otpData = localStorage.getItem("otpData");
  if (!otpData) return { isOtpSend: false, email: "" };

  try {
    const parsed = JSON.parse(otpData);
    const otpTime = new Date(parsed.date);
    const now = new Date();
    const diffInMinutes = (now.getTime() - otpTime.getTime()) / (1000 * 60);

    if (diffInMinutes <= 10) {
      return { isOtpSend: true, email: parsed.email || "" };
    }
  } catch (error) {
    console.error("Ошибка при парсинге otpData:", error);
  }

  return { isOtpSend: false, email: "" };
};

export function UserAuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const initialData = getInitialOtpData();
  const [isOtpSend, setIsOtpSend] = useState(initialData.isOtpSend);
  const [email, setEmail] = useState(initialData.email);
  const [otp, setOtp] = useState("");

  const { sendOTP, isLoading } = useSendOTP({
    onSuccess: () => {
      setIsOtpSend(true);
      localStorage.setItem(
        "otpData",
        JSON.stringify({
          email,
          date: new Date().toISOString(),
        }),
      );
    },
  });
  const { verifyOTP, isLoading: isVerifyLoading } = useVerifyOTP({
    onSuccess: () => {
      setIsOtpSend(false);
      localStorage.removeItem("otpData");
    },
  });

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isOtpSend) {
      verifyOTP({ email, code: otp });
    } else {
      sendOTP({ email });
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          {isOtpSend ? (
            <Otp value={otp} setValue={setOtp} />
          ) : (
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <Button disabled={isLoading || isVerifyLoading} type="submit">
            {isOtpSend ? "Войти" : "Отправить код"}
          </Button>
        </div>
      </form>
    </div>
  );
}
