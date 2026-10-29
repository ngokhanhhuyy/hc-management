import { displayNames } from "#/api";

export function getDisplayNameByKey(key: string): string | null {
  return displayNames[key as keyof typeof displayNames] ?? null;
}

