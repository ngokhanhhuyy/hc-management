export function joinClassName(...classNames: (string | false | null | undefined)[]): string | undefined {
  return classNames.filter(n => n).join(" ");
}

export function compute<T>(computer: () => T): T {
  return computer();
}