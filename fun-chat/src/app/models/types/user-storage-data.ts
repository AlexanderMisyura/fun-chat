import type { StorageKey } from '@constants';
import type { StoredUser } from '@ts-types';

export type UserStorageData = {
  [StorageKey.USER]: StoredUser;
};
