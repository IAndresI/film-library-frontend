import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/shared/api/query-client";

import { useNavigate } from "react-router-dom";
import type { IActorEditorForm } from "../../model";
import type { IActor } from "@/entities/actor/dto";
import { actorEditorApi } from "../../api";

export const useAddActor = (props?: {
  onSuccess?:
    | ((
        data: IActor,
        variables: IActorEditorForm,
        context: unknown,
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const { onSuccess } = props || {};

  const navigate = useNavigate();

  const {
    mutate: addActor,
    isPending: isLoading,
    error,
    ...mutationProps
  } = useMutation({
    mutationFn: actorEditorApi.addActor,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["actors"] });
      onSuccess?.(data, variables, context);
      navigate(`/admin/actors/${data.id}`);
    },
  });

  return {
    addActor,
    isLoading,
    error,
    ...mutationProps,
  };
};
