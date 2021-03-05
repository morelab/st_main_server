/** @format */
import { expect } from 'chai';
import faker from 'faker';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import User from '../../src/core/entities/User';
import UsersMongo from '../../src/dataSources/usersMongo.datasource';

let userDatabase: UsersMongo;

describe('UsersMongo Data Source', () => {
  const password = faker.internet.password();
  const preSaveUser: User = {
    id: faker.random.uuid(),
    name: faker.name.firstName(),
    anonymous: faker.random.boolean(),
    priv: faker.random.number(),
    username: faker.name.firstName(),
    password,
    smartPlug: {
      in_use: faker.random.boolean(),
      location: 'sp_w.r1.c1',
      name: faker.name.lastName(),
    },
    devices: [{ name: faker.name.jobArea() }],
    profile: {
      age: faker.random.number(),
      barriers: faker.random.number(),
      big_5: faker.random.number(),
      city: faker.random.number(),
      education: faker.random.number(),
      gender: faker.random.number(),
      initiative_to_join: faker.random.number(),
      intentions: faker.random.number(),
      position: faker.random.number(),
      pst_profile: faker.random.number(),
      pst_self_profile: faker.random.number(),
      work_culture: faker.random.number(),
    },
  };
  const user: User = {
    id: faker.random.uuid(),
    name: faker.name.firstName(),
    anonymous: faker.random.boolean(),
    priv: faker.random.number(),
    username: faker.name.firstName(),
    password: faker.internet.password(),
    smartPlug: {
      in_use: faker.random.boolean(),
      location: 'sp_w.r2.c1',
      name: faker.name.lastName(),
    },
    devices: [{ name: faker.name.jobArea() }],
    profile: {
      age: faker.random.number(),
      barriers: faker.random.number(),
      big_5: faker.random.number(),
      city: faker.random.number(),
      education: faker.random.number(),
      gender: faker.random.number(),
      initiative_to_join: faker.random.number(),
      intentions: faker.random.number(),
      position: faker.random.number(),
      pst_profile: faker.random.number(),
      pst_self_profile: faker.random.number(),
      work_culture: faker.random.number(),
    },
  };
  before(async () => {
    userDatabase = new UsersMongo();
  });
  after(async () => {
    await userDatabase.closeConnection();
  });
  beforeEach(async () => {
    await userDatabase.saveUser(preSaveUser);
  });
  afterEach(async () => {
    (await userDatabase.collection).drop();
    preSaveUser.password = password;
  });
  describe('Save user', async () => {
    it('Should return true. New user has been stored in the database', async () => {
      const userStored = await userDatabase.saveUser(user);
      expect(userStored).true;
    });
    it('Should return false. The user was already stored in the database', async () => {
      const userStored = await userDatabase.saveUser(preSaveUser);
      expect(userStored).false;
    });
  });
  describe('Validate user', () => {
    it('Should return true. The user has been validated successfully', async () => {
      const userValidated = await userDatabase.validateUser(
        preSaveUser,
        password,
      );
      expect(userValidated).true;
    });
    it('Should return false. User validation fails', async () => {
      const userValidated = await userDatabase.validateUser(preSaveUser, 'a');
      expect(userValidated).false;
    });
  });
  describe('Get User by username', async () => {
    it('Should return the user', async () => {
      const databaseUser = await userDatabase.getUserByUsername(
        preSaveUser.username,
      );
      expect(databaseUser.id).to.be.equal(preSaveUser.id);
      expect(databaseUser.username).to.be.equal(preSaveUser.username);
      expect(databaseUser.smartPlug).to.be.deep.equal(preSaveUser.smartPlug);
    });
    it('Should return undefined', async () => {
      const databaseUser = await userDatabase.getUserByUsername('a');
      expect(databaseUser).to.be.null;
    });
  });
  describe('Get User by id', async () => {
    it('Should return the user', async () => {
      const databaseUser = await userDatabase.getUserById(preSaveUser.id);
      expect(databaseUser.id).to.be.equal(preSaveUser.id);
      expect(databaseUser.username).to.be.equal(preSaveUser.username);
      expect(databaseUser.smartPlug).to.be.deep.equal(preSaveUser.smartPlug);
    });
    it('Should return undefined', async () => {
      const databaseUser = await userDatabase.getUserById('a');
      expect(databaseUser).to.be.null;
    });
  });
  describe('Get User by smartplug location', async () => {
    it('Should return the user', async () => {
      const databaseUser = await userDatabase.getUserBySmartPlugLocation(
        preSaveUser.smartPlug.location,
      );
      expect(databaseUser.id).to.be.equal(preSaveUser.id);
      expect(databaseUser.username).to.be.equal(preSaveUser.username);
      expect(databaseUser.smartPlug).to.be.deep.equal(preSaveUser.smartPlug);
    });
    it('Should return undefined', async () => {
      const databaseUser = await userDatabase.getUserBySmartPlugLocation('a');
      expect(databaseUser).to.be.null;
    });
  });
  describe('Update user anonymous flag', () => {
    it('Flag updated successfully', async () => {
      const stateChanged = await userDatabase.updateUserAnonymousById(
        preSaveUser.id,
        preSaveUser.anonymous,
      );
      expect(stateChanged).true;
    });
  });
  describe('Update user smartplug in_user flag', () => {
    it('Flag updated successfully', async () => {
      const stateChanged = await userDatabase.updateUserSmartPlugInUseById(
        preSaveUser.id,
        preSaveUser.smartPlug,
      );
      expect(stateChanged).true;
    });
  });
  describe('Delete user', () => {
    it('Flag updated successfully', async () => {
      const userDeleted = await userDatabase.deleteUserById(preSaveUser.id);
      expect(userDeleted).true;
    });
  });
});
