import type { STORAGE_KEY } from '@constants';
import type { StoredUser } from '@ts-types';

export type UserStorageData = {
  [STORAGE_KEY.USER]: StoredUser;
};
