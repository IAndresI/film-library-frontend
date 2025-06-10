import type { IUser } from "@/entities/user/dto";

// Типы для OTP
export interface SendOTPRequest {
  email: string;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPRequest {
  email: string;
  code: string;
}

export interface VerifyOTPResponse {
  token: string;
  user: IUser;
}
