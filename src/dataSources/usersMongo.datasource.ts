/** @format */

import bcrypt from 'bcrypt';
import { Collection, MongoClient } from 'mongodb';
import {
  databaseCollection,
  databaseName,
  databaseUrl,
  testDatabaseName,
} from '../configuration/configuration';
import SmartPlug from '../core/entities/SmartPlug';
import User from '../core/entities/User';
import UserDatabaseRepository from '../core/repositories/userDatabase.repository';
import passwordEncryption from '../shared/services/authentication/passwordEncriptation.services';
import logger from '../utils/logger';

export default class UsersMongo implements UserDatabaseRepository {
  collection: Promise<Collection<User>>;

  client: MongoClient;

  constructor() {
    this.collection = this.databaseConnection();
  }

  public updateUserSmartPlugInUseById = async (
    id: string,
    actualUserSmartPlug: SmartPlug,
  ): Promise<boolean> => {
    const smartPlug: SmartPlug = {
      in_use: !actualUserSmartPlug.in_use,
      location: actualUserSmartPlug.location,
      name: actualUserSmartPlug.name,
    };

    const userSmartPlugUpdated: boolean = await (await this.collection)
      .findOneAndUpdate({ id }, { $set: { smartPlug } })
      .then(() => true)
      .catch((error) => {
        logger.error(error);
        return false;
      });
    return userSmartPlugUpdated;
  };

  public updateUserAnonymousById = async (
    id: string,
    actualAnonymous: boolean,
  ): Promise<boolean> => {
    const anonymous = !actualAnonymous;
    const updatedUser: boolean = await (await this.collection)
      .findOneAndUpdate({ id }, { $set: { anonymous } })
      .then(() => true)
      .catch((error) => {
        logger.error(error);
        return false;
      });
    return updatedUser;
  };

  public deleteUserById = async (userId: string): Promise<boolean> => {
    const userDeleted = await (await this.collection)
      .deleteOne({ id: userId })
      .then(() => true)
      .catch((error) => {
        logger.error(error);
        return false;
      });
    return userDeleted;
  };

  public getUserByUsername = async (username: string): Promise<User> => {
    const user: User = await (await this.collection).findOne({ username });
    return user;
  };

  public getUserBySmartPlugLocation = async (
    location: string,
  ): Promise<User> => {
    const user: User = await (await this.collection).findOne({
      'smartPlug.location': location,
    });
    return user;
  };

  public getUserById = async (userId: string): Promise<User> => {
    const user: User = await (await this.collection).findOne({
      id: userId,
    });
    return user;
  };

  public validateUser = async (
    user: User,
    password: string,
  ): Promise<boolean> => {
    const validUser: boolean = await bcrypt
      .compare(password, user.password)
      .catch((error) => {
        logger.error(error);
        return false;
      });
    return validUser;
  };

  public saveUser = async (user: User): Promise<boolean> => {
    const newPassword: string = await passwordEncryption(user.password);
    const userWithEncryptedPassword: User = user;
    userWithEncryptedPassword.password = newPassword;
    const userStored = this.collection.then((collection) =>
      collection
        .insertOne(userWithEncryptedPassword)
        .then(() => true)
        .catch(() => {
          logger.error('The user could not be stored in the database');
          return false;
        }),
    );
    return userStored;
  };

  private databaseConnection = async () => {
    this.client = await MongoClient.connect(databaseUrl, {
      useUnifiedTopology: true,
    });
    let db;
    if (process.env.NODE_ENV !== 'test') {
      db = this.client.db(databaseName);
      logger.info(`Database connected to ${databaseName}`);
    } else {
      db = this.client.db(testDatabaseName);
    }
    return db.collection(databaseCollection);
  };

  public closeConnection = async (): Promise<void> => {
    await this.client.close();
  };
}
