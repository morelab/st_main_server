/** @format */

import chai, { expect } from 'chai';
import faker from 'faker';
import { after, afterEach, beforeEach, describe, it } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import User from '../../../src/core/entities/User';
import dashboardInteractor from '../../../src/core/interactors/dashboard.interactors';
import ConsumptionEquivalence from '../../../src/dataSources/consumptionEquivalence.datasource';
import IoToadAPI from '../../../src/dataSources/ioToadApi.datasource';
import UsersMongo from '../../../src/dataSources/usersMongo.datasource';
import TokenAuthentication from '../../../src/shared/services/authentication/tokenAuthentication.services';

chai.use(sinonChai);

let sandbox: sinon.SinonSandbox;

const userDatabaseRepository = new UsersMongo();
const tokenRepository = new TokenAuthentication();
const consumptionEquivalenceRepository = new ConsumptionEquivalence();
const ioToadAPIRepository = new IoToadAPI();

const DashboardInteractor = dashboardInteractor(
  userDatabaseRepository,
  tokenRepository,
  consumptionEquivalenceRepository,
  ioToadAPIRepository,
);

describe('Dashboard interactor', () => {
  const token = faker.random.alphaNumeric();
  const date = 100000000000;
  const dateToParse = date * 1000000;
  const dashboardReturn = {
    todayData: [[date, 1]],
    yesterdayData: [[date, 1]],
    weekData: [[date, 1]],
    monthData: [[date, 1]],
    user: true,
    equivalence: 'equivalence',
  };
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

  it('Should return 200 and user consumption information', async () => {
    sandbox.stub(tokenRepository, 'validateToken').returns('userId');
    sandbox.stub(userDatabaseRepository, 'getUserById').resolves(user);
    sandbox
      .stub(
        consumptionEquivalenceRepository,
        'getSmartPlugConsumptionEquivalence',
      )
      .resolves('equivalence');
    sandbox
      .stub(ioToadAPIRepository, 'getConsumption')
      .resolves([{ n: '1', t: dateToParse, u: '1', v: 1 }]);

    const interactorResponse = await DashboardInteractor(token);

    expect(interactorResponse.statusCode).to.be.equal(200);
    expect(interactorResponse.value).to.be.deep.equal(dashboardReturn);
    expect(interactorResponse.value).all.keys(dashboardReturn);
  });

  it('Should return 403 and error message. Invalid token', async () => {
    sandbox.stub(tokenRepository, 'validateToken').returns(undefined);

    const interactorResponse = await DashboardInteractor(token);

    expect(interactorResponse.statusCode).to.be.equal(403);
    expect(interactorResponse.value).to.be.deep.equal({
      error: 'Invalid token',
    });
  });

  it('Should return 404 and error message. User is not stored in the database', async () => {
    sandbox.stub(tokenRepository, 'validateToken').returns('userId');
    sandbox.stub(userDatabaseRepository, 'getUserById').resolves(undefined);

    const interactorResponse = await DashboardInteractor(token);

    expect(interactorResponse.statusCode).to.be.equal(404);
    expect(interactorResponse.value).to.be.deep.equal({
      error: 'User could not be found in the database',
    });
  });
  it('Should return 424 and error message. Error with equivalence microservice connection', async () => {
    sandbox.stub(tokenRepository, 'validateToken').returns('userId');
    sandbox.stub(userDatabaseRepository, 'getUserById').resolves(user);
    sandbox
      .stub(
        consumptionEquivalenceRepository,
        'getSmartPlugConsumptionEquivalence',
      )
      .resolves(undefined);

    const interactorResponse = await DashboardInteractor(token);

    expect(interactorResponse.statusCode).to.be.equal(424);
    expect(interactorResponse.value).to.be.deep.equal({
      error: 'Error with equivalence microservice',
    });
  });

  it('Should return 424 and user consumption information. Error with IoToad connection', async () => {
    sandbox.stub(tokenRepository, 'validateToken').returns('userId');
    sandbox.stub(userDatabaseRepository, 'getUserById').resolves(user);
    sandbox
      .stub(
        consumptionEquivalenceRepository,
        'getSmartPlugConsumptionEquivalence',
      )
      .resolves('equivalence');
    sandbox.stub(ioToadAPIRepository, 'getConsumption').resolves(undefined);

    const interactorResponse = await DashboardInteractor(token);

    expect(interactorResponse.statusCode).to.be.equal(424);
    expect(interactorResponse.value).to.be.deep.equal({
      error: 'Error fetching the user consumption',
    });
  });
});
