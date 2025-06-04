import { apiInstance } from "@/shared/api/base";
import { queryOptions } from "@tanstack/react-query";
import type { IUser } from "@/entities/user/dto";
import { queryClient } from "@/shared/api/query-client";
import type { VerifyOTPResponse } from "../model/auth.model";
import type { VerifyOTPRequest } from "../model/auth.model";
import type { SendOTPResponse } from "../model/auth.model";
import type { SendOTPRequest } from "../model/auth.model";

export const authApi = {
  getAuthQueryOptions: () => {
    return queryOptions({
      queryKey: ["user"],
      queryFn: apiInstance.get<IUser>(`/auth/me`),
    });
  },
  sendOTP: (data: SendOTPRequest): Promise<SendOTPResponse> =>
    apiInstance.post<SendOTPResponse>("/auth/send-otp", data),
  verifyOTP: (data: VerifyOTPRequest): Promise<VerifyOTPResponse> =>
    apiInstance.post<VerifyOTPResponse>("/auth/verify-otp", data),
  logout: () => {
    localStorage.removeItem("token");
    queryClient.resetQueries({ queryKey: ["user"] });
  },
};
