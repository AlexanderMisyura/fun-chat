import type { StoredUser } from '@ts-types';

export default class ValidatorService {
  private static _instance: ValidatorService | undefined;
  private constructor() {}

  public static get instance(): ValidatorService {
    if (!ValidatorService._instance) {
      ValidatorService._instance = new ValidatorService();
    }

    return ValidatorService._instance;
  }

  public validateStoredUser(storedUser: unknown): storedUser is StoredUser {
    return (
      typeof storedUser === 'object' &&
      storedUser !== null &&
      'username' in storedUser &&
      'id' in storedUser &&
      'isLoggedIn' in storedUser &&
      (typeof storedUser.username === 'string' ||
        typeof storedUser.username === 'number' ||
        storedUser.username === null) &&
      (typeof storedUser.id === 'string' || storedUser.id === null) &&
      typeof storedUser.isLoggedIn === 'boolean'
    );
  }
}
