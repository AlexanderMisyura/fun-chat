export default class SessionStorageService<StorageDataType> {
  constructor(private storagePrefix: string) {}

  public saveData<Key extends keyof StorageDataType>(key: Key, data: StorageDataType[Key]): void {
    const storageKey = this.getStorageKey(key.toString());
    sessionStorage.setItem(storageKey, JSON.stringify(data));
  }

  public getData<Key extends keyof StorageDataType>(
    key: Key,
    parseFunction: (
      storedData: string | null,
      validatorFunction: (data: unknown) => data is StorageDataType[Key]
    ) => StorageDataType[Key] | undefined,
    defaultData: StorageDataType[Key],
    validatorFunction: (data: unknown) => data is StorageDataType[Key]
  ): StorageDataType[Key] | undefined {
    const storageKey = this.getStorageKey(key.toString());
    const storedData = sessionStorage.getItem(storageKey);

    return parseFunction(storedData, validatorFunction);
  }

  private getStorageKey(key: string): string {
    return `${this.storagePrefix}_${key}`;
  }
}
