import { useMutation } from "@tanstack/react-query";
import { actorEditorApi } from "../../api/actorEditorApi";
import { queryClient } from "@/shared/api/query-client";
import type { IActorEditorForm } from "../../model";
import type { IActor } from "@/entities/actor/dto";

export const useEditActorData = (props?: {
  onSuccess?:
    | ((
        data: IActor,
        variables: IActorEditorForm,
        context: unknown,
      ) => Promise<unknown> | unknown)
    | undefined;
}) => {
  const { onSuccess } = props || {};

  const {
    mutate: editActor,
    isPending: isLoading,
    error,
    ...mutationProps
  } = useMutation({
    mutationFn: actorEditorApi.editActorData,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["actors"] });
      queryClient.invalidateQueries({ queryKey: ["actors", variables.id] });
      onSuccess?.(data, variables, context);
    },
  });

  return {
    editActor,
    isLoading,
    error,
    ...mutationProps,
  };
};
