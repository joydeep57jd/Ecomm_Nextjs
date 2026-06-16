import clsx, { type ClassValue } from "clsx"

/** Tiny class joiner used across the Super Shopping (Tailwind) surfaces. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
