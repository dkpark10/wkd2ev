import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * @description classname override를 위한 유틸 
 * @example px-4 px-2 --> px-2가 덮어씀
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
