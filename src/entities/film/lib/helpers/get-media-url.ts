import { MEDIA_BASE_URL } from '@/shared/config';

export const getMediaUrl = (url: string) => {
  return `${MEDIA_BASE_URL}${url}`;
};
