import { MEDIA_BASE_URL } from '@/shared/config';

export function getImageUrl(image?: string) {
  return image ? `${MEDIA_BASE_URL}${image}` : undefined;
}
