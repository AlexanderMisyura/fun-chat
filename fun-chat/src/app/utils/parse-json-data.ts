export function parseJSONData<DataType>(
  data: string | null,
  validatorFunction: (data: unknown) => data is DataType
): DataType | undefined {
  let parsed: unknown;

  try {
    parsed = data === null ? undefined : JSON.parse(data);
  } catch {
    parsed = undefined;
  }

  if (validatorFunction(parsed)) {
    return parsed;
  }
  return undefined;
}
