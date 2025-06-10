import { MEDIA_URL } from "@/shared/config";

export const getMediaUrl = (url: string) => {
  return `${MEDIA_URL}${url}`;
};
