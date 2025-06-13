import type { ClassValue } from 'clsx';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { MEDIA_URL } from '@/shared/config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(image?: string) {
  return image ? `${MEDIA_URL}${image}` : undefined;
}
