/** @format */

import chai, { expect } from 'chai';
import faker from 'faker';
import { after, afterEach, beforeEach, describe, it } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import SmartPlug from '../../../src/core/entities/SmartPlug';
import User from '../../../src/core/entities/User';
import signUpInteractor from '../../../src/core/interactors/signUp.interactors';
import IoToadAPI from '../../../src/dataSources/ioToadApi.datasource';
import UsersMongo from '../../../src/dataSources/usersMongo.datasource';
import TokenAuthentication from '../../../src/shared/services/authentication/tokenAuthentication.services';

chai.use(sinonChai);

let sandbox: sinon.SinonSandbox;

const userDatabaseRepository = new UsersMongo();
const tokenRepository = new TokenAuthentication();
const ioToadAPIRepository = new IoToadAPI();

const SignUpInteractor = signUpInteractor(
  userDatabaseRepository,
  tokenRepository,
  ioToadAPIRepository,
);

describe('SignUp interactor', () => {
  const username = faker.internet.userName();
  const password = faker.internet.password();
  const anonymous = true;
  const name = faker.name.firstName();
  const priv = faker.random.number();
  const smartPlug: SmartPlug = {
    location: 'sp_w.r0.c1',
    in_use: true,
    name: 'a',
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
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });
  after(() => {
    userDatabaseRepository.closeConnection();
  });

  it('Should return 200 and token', async () => {
    sandbox
      .stub(userDatabaseRepository, 'getUserByUsername')
      .resolves(undefined);
    sandbox.stub(userDatabaseRepository, 'saveUser').resolves(true);
    sandbox.stub(ioToadAPIRepository, 'setSmartPlugState').resolves(true);
    sandbox.stub(tokenRepository, 'generateToken').returns('token');

    const interactorResponse = await SignUpInteractor(
      username,
      password,
      anonymous,
      name,
      priv,
      undefined,
      undefined,
      smartPlug,
    );

    expect(interactorResponse.statusCode).to.be.equal(200);
    expect(interactorResponse.value).to.be.equal('token');
  });

  it('Should return 403 and error error message. The username already exists in the database', async () => {
    sandbox.stub(userDatabaseRepository, 'getUserByUsername').resolves(user);

    const interactorResponse = await SignUpInteractor(
      username,
      password,
      anonymous,
      name,
      priv,
      undefined,
      undefined,
      smartPlug,
    );

    expect(interactorResponse.statusCode).to.be.equal(403);
    expect(interactorResponse.value).to.be.deep.equal({
      error: 'Username already exists',
    });
  });

  it('Should return 500 and error message. Error trying to store the user in the database', async () => {
    sandbox
      .stub(userDatabaseRepository, 'getUserByUsername')
      .resolves(undefined);
    sandbox.stub(userDatabaseRepository, 'saveUser').resolves(false);

    const interactorResponse = await SignUpInteractor(
      username,
      password,
      anonymous,
      name,
      priv,
      undefined,
      undefined,
      smartPlug,
    );

    expect(interactorResponse.statusCode).to.be.equal(500);
    expect(interactorResponse.value).to.be.deep.equal({
      error: 'An error ocurred saving the user, try again later',
    });
  });

  it('Should return 424 and error message. Error with IoToad', async () => {
    sandbox
      .stub(userDatabaseRepository, 'getUserByUsername')
      .resolves(undefined);
    sandbox.stub(userDatabaseRepository, 'saveUser').resolves(true);
    sandbox.stub(ioToadAPIRepository, 'setSmartPlugState').resolves(false);

    const interactorResponse = await SignUpInteractor(
      username,
      password,
      anonymous,
      name,
      priv,
      undefined,
      undefined,
      smartPlug,
    );

    expect(interactorResponse.statusCode).to.be.equal(424);
    expect(interactorResponse.value).to.be.deep.equal({
      error: 'Error with IoToad',
    });
  });
});
