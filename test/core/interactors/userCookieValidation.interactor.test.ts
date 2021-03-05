/** @format */

import chai, { expect } from 'chai';
import faker from 'faker';
import { afterEach, beforeEach, describe, it } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import userCookieValidationInteractor from '../../../src/core/interactors/userCookieValidation.interactor';
import TokenAuthentication from '../../../src/shared/services/authentication/tokenAuthentication.services';

chai.use(sinonChai);

let sandbox: sinon.SinonSandbox;

const tokenRepository = new TokenAuthentication();

const UserCookieValidationInteractor = userCookieValidationInteractor(
  tokenRepository,
);

describe('User Cookie Validation Interactor', () => {
  const token = faker.random.alphaNumeric();
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  it('Should return 200 and success message', () => {
    sandbox.stub(tokenRepository, 'validateToken').returns('userId');

    const interactorResponse = UserCookieValidationInteractor(token);

    expect(interactorResponse.statusCode).to.be.equal(200);
    expect(interactorResponse.value).to.be.deep.equal({
      success: true,
    });
  });

  it('Should return 403 and error message. Invalid token', () => {
    sandbox.stub(tokenRepository, 'validateToken').returns(undefined);

    const interactorResponse = UserCookieValidationInteractor(token);

    expect(interactorResponse.statusCode).to.be.equal(403);
    expect(interactorResponse.value).to.be.deep.equal({
      error: 'Invalid token',
    });
  });
});
