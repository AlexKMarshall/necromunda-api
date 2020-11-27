export function removeProp<T, K extends keyof T>(prop: K, obj: T): Omit<T, K> {
  // eslint-disable-next-line no-unused-vars
  const { [prop]: _, ...rest } = obj;
  return rest;
}
