/** @format */

import chai, { expect } from 'chai';
import faker from 'faker';
import { after, afterEach, beforeEach, describe, it } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import User from '../../../src/core/entities/User';
import smartPlugValidationInteractor from '../../../src/core/interactors/smartplugValidation.interactors';
import SmartPlugEtcd from '../../../src/dataSources/smartPlugsEtcd.datasource';
import UsersMongo from '../../../src/dataSources/usersMongo.datasource';

chai.use(sinonChai);

let sandbox: sinon.SinonSandbox;

const smartPlugDatabaseRepository = new SmartPlugEtcd();
const userDatabaseRepository = new UsersMongo();

const SmartPlugValidationInteractor = smartPlugValidationInteractor(
  smartPlugDatabaseRepository,
  userDatabaseRepository,
);

describe('SmartPlug Validation Interactor', () => {
  const location: string = 'sp_w.r0.c1';
  const user: User = {
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

  it('Should return 200 and smartPlugId', async () => {
    sandbox
      .stub(smartPlugDatabaseRepository, 'getSmartPlugUserIdById')
      .resolves('smartPlugId');
    sandbox
      .stub(userDatabaseRepository, 'getUserBySmartPlugLocation')
      .resolves(undefined);

    const interactorResponse = await SmartPlugValidationInteractor(location);

    expect(interactorResponse.statusCode).to.be.equal(200);
    expect(interactorResponse.value).to.be.equal('smartPlugId');
  });

  it('Should return 406 and error message. SmartPlug location not found', async () => {
    sandbox
      .stub(smartPlugDatabaseRepository, 'getSmartPlugUserIdById')
      .resolves(undefined);

    const interactorResponse = await SmartPlugValidationInteractor(location);

    expect(interactorResponse.statusCode).to.be.equal(406);
    expect(interactorResponse.value).to.be.deep.equal({
      error: 'SmartPlug location not found',
    });
  });

  it('Should return 403 and error message. SmartPlug is already in use', async () => {
    sandbox
      .stub(smartPlugDatabaseRepository, 'getSmartPlugUserIdById')
      .resolves('smartPlugId');
    sandbox
      .stub(userDatabaseRepository, 'getUserBySmartPlugLocation')
      .resolves(user);

    const interactorResponse = await SmartPlugValidationInteractor(location);

    expect(interactorResponse.statusCode).to.be.equal(403);
    expect(interactorResponse.value).to.be.deep.equal({
      error: 'SmartPlug location already assigned to other user',
    });
  });
});
