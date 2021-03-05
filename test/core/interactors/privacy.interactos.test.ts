/** @format */

import chai, { expect } from 'chai';
import faker from 'faker';
import { after, afterEach, beforeEach, describe, it } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import User from '../../../src/core/entities/User';
import privacyInteractor from '../../../src/core/interactors/privacy.interactors';
import UsersMongo from '../../../src/dataSources/usersMongo.datasource';
import TokenAuthentication from '../../../src/shared/services/authentication/tokenAuthentication.services';

chai.use(sinonChai);

let sandbox: sinon.SinonSandbox;

const userDatabaseRepository = new UsersMongo();
const tokenRepository = new TokenAuthentication();

const PrivacyInteractor = privacyInteractor(
  userDatabaseRepository,
  tokenRepository,
);

describe('Privacy interactor', () => {
  const token = faker.random.alphaNumeric();
  const user: User = {
    id: faker.random.uuid(),
    anonymous: true,
    devices: undefined,
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

  it('Should return 200 and success equal to true', async () => {
    sandbox.stub(tokenRepository, 'validateToken').returns('userId');
    sandbox.stub(userDatabaseRepository, 'getUserById').resolves(user);
    sandbox
      .stub(userDatabaseRepository, 'updateUserAnonymousById')
      .resolves(true);

    const interactorResponse = await PrivacyInteractor(token);

    expect(interactorResponse.statusCode).to.be.equal(200);
    expect(interactorResponse.value).to.deep.equal({ success: true });
  });

  it('Should return 403 and error message. Invalid token', async () => {
    sandbox.stub(tokenRepository, 'validateToken').returns(undefined);

    const interactorResponse = await PrivacyInteractor(token);

    expect(interactorResponse.statusCode).to.be.equal(403);
    expect(interactorResponse.value).to.deep.equal({ error: 'Invalid token' });
  });

  it('Should return 403 and error message. User is not stores in the database', async () => {
    sandbox.stub(tokenRepository, 'validateToken').returns('userId');
    sandbox.stub(userDatabaseRepository, 'getUserById').resolves(undefined);

    const interactorResponse = await PrivacyInteractor(token);

    expect(interactorResponse.statusCode).to.be.equal(404);
    expect(interactorResponse.value).to.deep.equal({
      error: 'User could not be found in the database',
    });
  });

  it('Should return 500 and error message. The user privacy flag could not be changed in the database', async () => {
    sandbox.stub(tokenRepository, 'validateToken').returns('userId');
    sandbox.stub(userDatabaseRepository, 'getUserById').resolves(user);
    sandbox
      .stub(userDatabaseRepository, 'updateUserAnonymousById')
      .resolves(false);

    const interactorResponse = await PrivacyInteractor(token);

    expect(interactorResponse.statusCode).to.be.equal(500);
    expect(interactorResponse.value).to.deep.equal({
      error: 'Error in user update',
    });
  });
});
