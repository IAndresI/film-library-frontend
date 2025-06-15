import type { SendOTPRequest, SendOTPResponse } from '../model/auth.model';

import { useMutation } from '@tanstack/react-query';

import { authApi } from '../api/auth.api';

export const useSendOTP = (props?: {
  onSuccess?:
    | ((
        data: SendOTPResponse,
        variables: SendOTPRequest,
        context: unknown
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const { onSuccess } = props || {};
  const {
    mutate: sendOTP,
    isPending: isLoading,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: authApi.sendOTP,
    onSuccess: (data, variables, context) => {
      onSuccess?.(data, variables, context);
    },
  });

  return {
    sendOTP,
    isLoading,
    error,
    isSuccess,
  };
};
