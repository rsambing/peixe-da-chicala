import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Lowercases and strips accents so searches match "chicala" against "Chicala". */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Angolan mobile numbers: 9 digits starting with 9, optional +244/244 prefix and spaces/dashes. */
export function isValidAngolanPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "").replace(/^244/, "");
  return /^9\d{8}$/.test(digits);
}
