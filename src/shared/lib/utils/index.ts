import { MEDIA_URL } from "@/shared/config";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(image?: string) {
  return image ? `${MEDIA_URL}${image}` : undefined;
}
