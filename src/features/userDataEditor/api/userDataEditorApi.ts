import type { IUser } from "@/entities/user/dto";
import { apiInstance } from "@/shared/api/base";

export const userDataEditorApi = {
  editUserData: ({ name, id }: { name: string; id: number }) =>
    apiInstance.put<IUser>(`/users/${id}`, { name }),
};
