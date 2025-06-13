import type {
  VerifyOTPRequest,
  VerifyOTPResponse,
} from '../../model/auth.model';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { queryClient } from '@/shared/api/query-client';

import { authApi } from '../../api/authApi';

export const useVerifyOTP = (props?: {
  onSuccess?:
    | ((
        data: VerifyOTPResponse,
        variables: VerifyOTPRequest,
        context: unknown
      ) => Promise<unknown> | unknown)
    | undefined;
  onError?:
    | ((
        error: Error,
        variables: VerifyOTPRequest,
        context: unknown
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const { onSuccess, onError } = props || {};
  const navigate = useNavigate();

  const {
    mutate: verifyOTP,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: authApi.verifyOTP,
    onSuccess: (data, variables, context) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        queryClient.setQueriesData({ queryKey: ['user'] }, data.user);
        navigate('/');
      }
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      onError?.(error, variables, context);
    },
  });

  return {
    verifyOTP,
    isLoading,
    error,
  };
};
