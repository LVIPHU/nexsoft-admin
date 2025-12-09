export const exclude = <T extends object, K extends readonly (keyof T)[]>(obj: T, keys: K): Omit<T, K[number]> => {
  const result: any = {};

  for (const key in obj) {
    if (!keys.includes(key as K[number])) {
      result[key] = obj[key];
    }
  }

  return result;
};
