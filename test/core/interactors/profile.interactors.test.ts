/** @format */

import chai, { expect } from 'chai';
import faker from 'faker';
import { after, afterEach, beforeEach, describe, it } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import User from '../../../src/core/entities/User';
import {
  deleteProfileInteractor,
  getProfileInteractor,
} from '../../../src/core/interactors/profile.interactors';
import IoToadAPI from '../../../src/dataSources/ioToadApi.datasource';
import UsersMongo from '../../../src/dataSources/usersMongo.datasource';
import TokenAuthentication from '../../../src/shared/services/authentication/tokenAuthentication.services';

chai.use(sinonChai);

let sandbox: sinon.SinonSandbox;

const userDatabaseRepository = new UsersMongo();
const tokenRepository = new TokenAuthentication();
const ioToadAPIRepository = new IoToadAPI();

const GetProfileInteractor = getProfileInteractor(
  tokenRepository,
  userDatabaseRepository,
);

const DeleteProfileInteractor = deleteProfileInteractor(
  tokenRepository,
  userDatabaseRepository,
  ioToadAPIRepository,
);

describe('Profile interactor', () => {
  const token = faker.random.alphaNumeric();
  const userIsNotAnonymous = {
    user: {
      username: 'a',
      anonymous: false,
      smartPlug: { location: 'sp_w.r0.c1', in_use: true, name: 'testSP' },
      devices: [{ name: 'a' }],
    },
  };
  const userIsAnonymous = {
    user: {
      username: 'testSP',
      anonymous: true,
      smartPlug: { location: 'sp_w.r0.c1', in_use: true, name: 'testSP' },
      devices: [{ name: 'a' }],
    },
  };
  const user: User = {
    id: faker.random.uuid(),
    anonymous: false,
    devices: [{ name: 'a' }],
    name: 'a',
    password: 'a',
    priv: 1,
    profile: undefined,
    smartPlug: { location: 'sp_w.r0.c1', in_use: true, name: 'testSP' },
    username: 'a',
  };
  const userAnonymous: User = {
    id: faker.random.uuid(),
    anonymous: true,
    devices: [{ name: 'a' }],
    name: 'a',
    password: 'a',
    priv: 1,
    profile: undefined,
    smartPlug: { location: 'sp_w.r0.c1', in_use: true, name: 'testSP' },
    username: 'a',
  };
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });
  after(() => {
    userDatabaseRepository.closeConnection();
  });

  describe('Get Profile Interactor', () => {
    it('Should return 200 and the user data. User is not anonymous', async () => {
      sandbox.stub(tokenRepository, 'validateToken').returns('userId');
      sandbox.stub(userDatabaseRepository, 'getUserById').resolves(user);

      const interactorResponse = await GetProfileInteractor(token);

      expect(interactorResponse.statusCode).to.be.equal(200);
      expect(interactorResponse.value).to.be.deep.equal(userIsNotAnonymous);
    });

    it('Should return 200 and the user data. User is anonymous', async () => {
      sandbox.stub(tokenRepository, 'validateToken').returns('userId');
      sandbox
        .stub(userDatabaseRepository, 'getUserById')
        .resolves(userAnonymous);

      const interactorResponse = await GetProfileInteractor(token);

      expect(interactorResponse.statusCode).to.be.equal(200);
      expect(interactorResponse.value).to.be.deep.equal(userIsAnonymous);
    });

    it('Should return 403 and error message. Invalid token', async () => {
      sandbox.stub(tokenRepository, 'validateToken').returns(undefined);

      const interactorResponse = await GetProfileInteractor(token);

      expect(interactorResponse.statusCode).to.be.equal(403);
      expect(interactorResponse.value).to.be.deep.equal({
        error: 'Invalid token',
      });
    });

    it('Should return 404 and error message. The user is not stored in the database', async () => {
      sandbox.stub(tokenRepository, 'validateToken').returns('userId');
      sandbox.stub(userDatabaseRepository, 'getUserById').resolves(undefined);

      const interactorResponse = await GetProfileInteractor(token);

      expect(interactorResponse.statusCode).to.be.equal(404);
      expect(interactorResponse.value).to.be.deep.equal({
        error: 'User could not be found in the database',
      });
    });
  });

  describe('Delete Profile Interactor', () => {
    it('Should return 200 and success message', async () => {
      sandbox.stub(tokenRepository, 'validateToken').returns('userId');
      sandbox.stub(userDatabaseRepository, 'getUserById').resolves(user);
      sandbox.stub(ioToadAPIRepository, 'setSmartPlugState').resolves(true);
      sandbox.stub(userDatabaseRepository, 'deleteUserById').resolves(true);

      const interactorResponse = await DeleteProfileInteractor(token);

      expect(interactorResponse.statusCode).to.be.equal(200);
      expect(interactorResponse.value).to.be.deep.equal({ success: true });
    });

    it('Should return 403 and error message. Invalid token', async () => {
      sandbox.stub(tokenRepository, 'validateToken').returns(undefined);

      const interactorResponse = await DeleteProfileInteractor(token);

      expect(interactorResponse.statusCode).to.be.equal(403);
      expect(interactorResponse.value).to.be.deep.equal({
        error: 'Invalid token',
      });
    });

    it('Should return 404 and error message. The user is not stored in the database', async () => {
      sandbox.stub(tokenRepository, 'validateToken').returns('userId');
      sandbox.stub(userDatabaseRepository, 'getUserById').resolves(undefined);

      const interactorResponse = await DeleteProfileInteractor(token);

      expect(interactorResponse.statusCode).to.be.equal(404);
      expect(interactorResponse.value).to.be.deep.equal({
        error: 'User could not be found in the database',
      });
    });

    it('Should return 424 and error message. Error with IoToad', async () => {
      sandbox.stub(tokenRepository, 'validateToken').returns('userId');
      sandbox.stub(userDatabaseRepository, 'getUserById').resolves(user);
      sandbox.stub(ioToadAPIRepository, 'setSmartPlugState').resolves(false);

      const interactorResponse = await DeleteProfileInteractor(token);

      expect(interactorResponse.statusCode).to.be.equal(424);
      expect(interactorResponse.value).to.be.deep.equal({
        error: 'Error with IoToad',
      });
    });

    it('Should return 500 and error message. The user has not been deleted from the database', async () => {
      sandbox.stub(tokenRepository, 'validateToken').returns('userId');
      sandbox.stub(userDatabaseRepository, 'getUserById').resolves(user);
      sandbox.stub(ioToadAPIRepository, 'setSmartPlugState').resolves(true);
      sandbox.stub(userDatabaseRepository, 'deleteUserById').resolves(false);

      const interactorResponse = await DeleteProfileInteractor(token);

      expect(interactorResponse.statusCode).to.be.equal(500);
      expect(interactorResponse.value).to.be.deep.equal({
        error: 'The user did not delete properly. Try again',
      });
    });
  });
});
