import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { queryClient } from "@/shared/api/query-client";
import type {
  VerifyOTPRequest,
  VerifyOTPResponse,
} from "../../model/auth.model";

export const useVerifyOTP = (props?: {
  onSuccess?:
    | ((
        data: VerifyOTPResponse,
        variables: VerifyOTPRequest,
        context: unknown,
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const { onSuccess } = props || {};
  const navigate = useNavigate();

  const {
    mutate: verifyOTP,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: authApi.verifyOTP,
    onSuccess: (data, variables, context) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        queryClient.setQueriesData({ queryKey: ["user"] }, data.user);
        navigate("/");
      }
      onSuccess?.(data, variables, context);
    },
  });

  return {
    verifyOTP,
    isLoading,
    error,
  };
};
