export function removeProp<T, K extends keyof T>(obj: T, prop: K): Omit<T, K> {
  // eslint-disable-next-line no-unused-vars
  const { [prop]: _, ...rest } = obj;
  return rest;
}
