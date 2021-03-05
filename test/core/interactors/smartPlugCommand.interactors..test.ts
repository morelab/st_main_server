/** @format */

import chai, { expect } from 'chai';
import faker from 'faker';
import { after, afterEach, beforeEach, describe, it } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import User from '../../../src/core/entities/User';
import smartPlugCommandInteractor from '../../../src/core/interactors/smartPlugCommand.interactors';
import IoToadAPI from '../../../src/dataSources/ioToadApi.datasource';
import UsersMongo from '../../../src/dataSources/usersMongo.datasource';
import TokenAuthentication from '../../../src/shared/services/authentication/tokenAuthentication.services';

chai.use(sinonChai);

let sandbox: sinon.SinonSandbox;

const userDatabaseRepository = new UsersMongo();
const tokenRepository = new TokenAuthentication();
const ioToadAPIRepository = new IoToadAPI();

const SmartPlugCommandInteractor = smartPlugCommandInteractor(
  tokenRepository,
  userDatabaseRepository,
  ioToadAPIRepository,
);

describe('SmartPlug Command Interactor', () => {
  const token = faker.random.alphaNumeric();
  const userSmartPlugInUse: User = {
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
  const userSmartPlugNotInUse: User = {
    id: faker.random.uuid(),
    anonymous: false,
    devices: [{ name: 'a' }],
    name: 'a',
    password: 'a',
    priv: 1,
    profile: undefined,
    smartPlug: { location: 'sp_w.r0.c1', in_use: false, name: 'testSP' },
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

  it('Should return 200 and success message. SmartPlug is in use', async () => {
    sandbox.stub(tokenRepository, 'validateToken').returns('userId');
    sandbox
      .stub(userDatabaseRepository, 'getUserById')
      .resolves(userSmartPlugInUse);
    sandbox.stub(ioToadAPIRepository, 'setSmartPlugState').resolves(true);
    sandbox
      .stub(userDatabaseRepository, 'updateUserSmartPlugInUseById')
      .resolves(true);

    const interactorResponse = await SmartPlugCommandInteractor(token);

    expect(interactorResponse.statusCode).to.be.equal(200);
    expect(interactorResponse.value).to.be.deep.equal({ success: true });
  });

  it('Should return 200 and success message. SmartPlug is not in use', async () => {
    sandbox.stub(tokenRepository, 'validateToken').returns('userId');
    sandbox
      .stub(userDatabaseRepository, 'getUserById')
      .resolves(userSmartPlugNotInUse);
    sandbox.stub(ioToadAPIRepository, 'setSmartPlugState').resolves(true);
    sandbox
      .stub(userDatabaseRepository, 'updateUserSmartPlugInUseById')
      .resolves(true);

    const interactorResponse = await SmartPlugCommandInteractor(token);

    expect(interactorResponse.statusCode).to.be.equal(200);
    expect(interactorResponse.value).to.be.deep.equal({ success: true });
  });

  it('Should return 403 and error message. Invalid token', async () => {
    sandbox.stub(tokenRepository, 'validateToken').returns(undefined);

    const interactorResponse = await SmartPlugCommandInteractor(token);

    expect(interactorResponse.statusCode).to.be.equal(403);
    expect(interactorResponse.value).to.be.deep.equal({
      error: 'Invalid token',
    });
  });
  it('Should return 404 and error message. User is not stored in the database', async () => {
    sandbox.stub(tokenRepository, 'validateToken').returns('userId');
    sandbox.stub(userDatabaseRepository, 'getUserById').resolves(undefined);

    const interactorResponse = await SmartPlugCommandInteractor(token);

    expect(interactorResponse.statusCode).to.be.equal(404);
    expect(interactorResponse.value).to.be.deep.equal({
      error: 'User could not be found in the database',
    });
  });

  it('Should return 424 and error message. Error with IoToad', async () => {
    sandbox.stub(tokenRepository, 'validateToken').returns('userId');
    sandbox
      .stub(userDatabaseRepository, 'getUserById')
      .resolves(userSmartPlugInUse);
    sandbox.stub(ioToadAPIRepository, 'setSmartPlugState').resolves(false);

    const interactorResponse = await SmartPlugCommandInteractor(token);

    expect(interactorResponse.statusCode).to.be.equal(424);
    expect(interactorResponse.value).to.be.deep.equal({
      error: 'Error with IoToad',
    });
  });

  it('Should return 500 and error message. The user data has not been updated in the database', async () => {
    sandbox.stub(tokenRepository, 'validateToken').returns('userId');
    sandbox
      .stub(userDatabaseRepository, 'getUserById')
      .resolves(userSmartPlugInUse);
    sandbox.stub(ioToadAPIRepository, 'setSmartPlugState').resolves(true);
    sandbox
      .stub(userDatabaseRepository, 'updateUserSmartPlugInUseById')
      .resolves(false);

    const interactorResponse = await SmartPlugCommandInteractor(token);

    expect(interactorResponse.statusCode).to.be.equal(500);
    expect(interactorResponse.value).to.be.deep.equal({
      error: 'Error in user update',
    });
  });
});
