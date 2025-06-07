import type { IUser } from "@/entities/user/dto";
import { apiInstance } from "@/shared/api/base";

export const userDataEditorApi = {
  editUserData: ({
    name,
    id,
    avatar,
  }: {
    name: string;
    id: number;
    avatar?: File | null;
  }) => {
    const formData = new FormData();
    formData.append("name", name);
    if (avatar) {
      formData.append("avatar", avatar);
    } else if (avatar === null) {
      formData.append("avatar", "null");
    }
    return apiInstance.put<IUser>(`/users/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
