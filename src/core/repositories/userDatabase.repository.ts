/** @format */

import SmartPlug from '../entities/SmartPlug';
import User from '../entities/User';

export default interface UserDatabaseRepository {
  deleteUserById(userId: string): Promise<boolean>;
  getUserBySmartPlugLocation(location: string): Promise<User>;
  getUserById(userId: string): Promise<User>;
  getUserByUsername(username: string): Promise<User>;
  saveUser(user: User): Promise<boolean>;
  updateUserAnonymousById(
    id: string,
    actualAnonymous: boolean,
  ): Promise<boolean>;
  updateUserSmartPlugInUseById(
    id: string,
    actualUserSmartPlug: SmartPlug,
  ): Promise<boolean>;
  validateUser(user: User, password: string): Promise<boolean>;
}
