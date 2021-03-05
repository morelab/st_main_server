/** @format */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import encryptPassword from '../../../../src/shared/services/authentication/passwordEncriptation.services';

describe('Password encryption service', () => {
  const password = 'password';
  it('Encrypt password', async () => {
    const encryptedPassword = await encryptPassword(password);
    expect(encryptedPassword).to.not.be.eq(password);
  });
});
