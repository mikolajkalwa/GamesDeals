export default function parseArgs<T>(options: Array<{ name: string, value: unknown }>): T {
  return Object.fromEntries(options.map((option) => [option.name, option.value])) as unknown as T;
}
