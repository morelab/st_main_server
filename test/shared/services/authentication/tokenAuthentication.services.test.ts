/** @format */

import { expect } from 'chai';
import faker from 'faker';
import { describe, it } from 'mocha';
import User from '../../../../src/core/entities/User';
import TokenAuthentication from '../../../../src/shared/services/authentication/tokenAuthentication.services';

const tokenAuthentication = new TokenAuthentication();

describe('Token authentication service', () => {
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
  const testToken = tokenAuthentication.generateToken(user);

  describe('Generate Token', () => {
    it('Generate JWT token', () => {
      const token = tokenAuthentication.generateToken(user);
      expect(token).not.to.be.null;
      expect(token).not.to.be.undefined;
    });
  });
  describe('Validate Token', () => {
    it('Valid Token', () => {
      const userId = tokenAuthentication.validateToken(testToken);
      expect(userId).to.be.equal(user.id);
    });
    it('Invalid Token', () => {
      const userId = tokenAuthentication.validateToken('a');
      expect(userId).to.be.undefined;
    });
  });
});
