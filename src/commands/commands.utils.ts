export function parseOptions<T>(options: Array<{ name: string, value: unknown }>): T {
  return Object.fromEntries(options.map((option) => [option.name, option.value])) as unknown as T;
}

export const parseArgs = (input:string): string[] => input.split(',').map((x) => x.trim());
