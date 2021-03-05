/** @format */

import chai, { expect } from 'chai';
import faker from 'faker';
import { after, afterEach, beforeEach, describe, it } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import User from '../../../src/core/entities/User';
import logInInteractor from '../../../src/core/interactors/logIn.interactors';
import UsersMongo from '../../../src/dataSources/usersMongo.datasource';
import TokenAuthentication from '../../../src/shared/services/authentication/tokenAuthentication.services';

chai.use(sinonChai);

let sandbox: sinon.SinonSandbox;

const userDatabaseRepository = new UsersMongo();
const tokenRepository = new TokenAuthentication();

const LogInInteractor = logInInteractor(
  userDatabaseRepository,
  tokenRepository,
);

describe('LogIn interactor', () => {
  const username = faker.internet.userName();
  const password = faker.internet.password();
  const user: User = {
    id: faker.random.uuid(),
    anonymous: true,
    devices: undefined,
    name: 'a',
    password: 'a',
    priv: 1,
    profile: undefined,
    smartPlug: undefined,
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
  it('Should return 200 and token when called', async () => {
    sandbox.stub(userDatabaseRepository, 'getUserByUsername').resolves(user);
    sandbox.stub(userDatabaseRepository, 'validateUser').resolves(true);
    sandbox.stub(tokenRepository, 'generateToken').returns('token');

    const interactorResponse = await LogInInteractor(username, password);

    expect(interactorResponse.statusCode).to.be.equal(200);
    expect(interactorResponse.value).to.be.equal('token');
  });

  it('Should return 403 and error message. Username has not been found in the database', async () => {
    sandbox
      .stub(userDatabaseRepository, 'getUserByUsername')
      .resolves(undefined);

    const interactorResponse = await LogInInteractor(username, password);

    expect(interactorResponse.statusCode).to.be.equal(403);
    expect(interactorResponse.value).to.be.deep.equal({
      error: 'User or password incorrect',
    });
  });

  it('Should return 403 and error message. Username and password do not match', async () => {
    sandbox.stub(userDatabaseRepository, 'getUserByUsername').resolves(user);
    sandbox.stub(userDatabaseRepository, 'validateUser').resolves(false);
    const interactorResponse = await LogInInteractor(username, password);

    expect(interactorResponse.statusCode).to.be.equal(403);
    expect(interactorResponse.value).to.be.deep.equal({
      error: 'User or password incorrect',
    });
  });
});
