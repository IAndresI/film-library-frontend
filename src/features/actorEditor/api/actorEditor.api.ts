import type { IActor } from '@/entities/actor/model';
import type { IActorEditorForm } from '../model';

import { apiInstance } from '@/shared/api/base';

export const actorEditorApi = {
  addActor: (actor: IActorEditorForm) => {
    const formData = new FormData();
    formData.append('name', actor.name);
    formData.append('description', actor.description);
    formData.append('birthday', actor.birthday);
    if (actor.image) {
      formData.append('image', actor.image);
    }
    formData.append('isVisible', actor.isVisible.toString());

    return apiInstance.post<IActor>('/actors', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  editActorData: ({ id, ...actor }: IActorEditorForm & { id: number }) => {
    const formData = new FormData();
    formData.append('name', actor.name);
    formData.append('description', actor.description);
    formData.append('birthday', actor.birthday);
    if (typeof actor.image === 'object') {
      formData.append('image', actor.image);
    } else if (actor.image === undefined) {
      formData.append('image', 'null');
    }
    formData.append('isVisible', actor.isVisible.toString());

    return apiInstance.put<IActor>(`/actors/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
