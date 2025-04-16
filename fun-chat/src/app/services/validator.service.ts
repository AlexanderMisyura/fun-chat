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
      typeof storedUser.username === 'string' &&
      'id' in storedUser &&
      typeof storedUser.id === 'string' &&
      'isLoggedIn' in storedUser &&
      typeof storedUser.isLoggedIn === 'boolean'
    );
  }
}
