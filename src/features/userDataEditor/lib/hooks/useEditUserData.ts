import { useMutation } from "@tanstack/react-query";
import { userDataEditorApi } from "../../api/userDataEditorApi";
import type { IUser } from "@/entities/user/dto";
import { queryClient } from "@/shared/api/query-client";

export const useEditUserData = (props?: {
  onSuccess?:
    | ((
        data: IUser,
        variables: { name: string; id: number },
        context: unknown,
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const { onSuccess } = props || {};

  const {
    mutate: editUserData,
    isPending: isLoading,
    error,
    ...mutationProps
  } = useMutation({
    mutationFn: userDataEditorApi.editUserData,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["users", variables.id],
      });
      onSuccess?.(data, variables, context);
    },
  });

  return {
    editUserData,
    isLoading,
    error,
    ...mutationProps,
  };
};
