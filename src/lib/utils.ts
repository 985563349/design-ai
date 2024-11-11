import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function base64toBlob(base64: string) {
  const response = await fetch(base64);
  const blob = await response.blob();

  return blob;
}
