import type { IUser } from '@/entities/user/model';
import type {
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from '../model/auth.model';

import { queryOptions } from '@tanstack/react-query';

import { apiInstance } from '@/shared/api/base';
import { queryClient } from '@/shared/api/query-client';

export const authApi = {
  getAuthQueryOptions: () => {
    return queryOptions({
      queryKey: ['user'],
      queryFn: apiInstance.get<IUser>(`/auth/me`),
    });
  },
  sendOTP: (data: SendOTPRequest): Promise<SendOTPResponse> =>
    apiInstance.post<SendOTPResponse>('/auth/send-otp', data),
  verifyOTP: (data: VerifyOTPRequest): Promise<VerifyOTPResponse> =>
    apiInstance.post<VerifyOTPResponse>('/auth/verify-otp', data),
  logout: () => {
    localStorage.removeItem('token');
    queryClient.resetQueries({ queryKey: ['user'] });
  },
};
