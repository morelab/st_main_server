// /** @format */

// import chai, { expect } from 'chai';
// import chaiHttp from 'chai-http';
// import * as faker from 'faker';
// import { after, before, describe, it } from 'mocha';
// import { MongoClient } from 'mongodb';
// import {
//   databaseUrl,
//   testDatabaseName,
// } from '../../../src/configuration/constants';
// import { userDatabaseRepository } from '../../../src/core/interactors';
// import server from '../../../src/server/index';

// chai.use(chaiHttp);

// describe('Authentication routes', () => {
//   const signUpPath: string = '/auth/new-account';
//   const logInPath: string = '/auth/login';
//   const logInUser: object = {
//     user: 'a',
//     pass: 'a',
//   };
//   const user: object = {
//     id: faker.random.uuid(),
//     name: faker.name.firstName(),
//     anonymous: faker.random.boolean(),
//     priv: faker.random.number(),
//     user: faker.name.firstName(),
//     pass: faker.internet.password(),
//     smartPlug: {
//       in_use: faker.random.boolean(),
//       location: 'sp_w.r1.c1',
//       name: faker.name.lastName(),
//     },
//     devices: [{ name: faker.name.jobArea() }],
//     profile: {
//       age: faker.random.number(),
//       barriers: faker.random.number(),
//       big_5: faker.random.number(),
//       city: faker.random.number(),
//       education: faker.random.number(),
//       gender: faker.random.number(),
//       initiative_to_join: faker.random.number(),
//       intentions: faker.random.number(),
//       position: faker.random.number(),
//       pst_profile: faker.random.number(),
//       pst_self_profile: faker.random.number(),
//       work_culture: faker.random.number(),
//     },
//   };
//   const preSave: object = {
//     id: faker.random.uuid,
//     name: 'a',
//     anonymous: true,
//     priv: 2,
//     user: 'a',
//     pass: 'a',
//     smartPlug: {
//       in_use: true,
//       location: 'sp_w.r1.c1',
//       name: faker.name.lastName(),
//     },
//     devices: [{ name: faker.name.jobArea() }],
//     profile: {
//       age: faker.random.number(),
//       barriers: faker.random.number(),
//       big_5: faker.random.number(),
//       city: faker.random.number(),
//       education: faker.random.number(),
//       gender: faker.random.number(),
//       initiative_to_join: faker.random.number(),
//       intentions: faker.random.number(),
//       position: faker.random.number(),
//       pst_profile: faker.random.number(),
//       pst_self_profile: faker.random.number(),
//       work_culture: faker.random.number(),
//     },
//   };
//   before(async () => {
//     const result = await chai.request(server).post(signUpPath).send(preSave);
//     expect(result.status).to.equal(200);
//   });

//   after('dropping test db', async () => {
//     const client = await MongoClient.connect(databaseUrl, {
//       useUnifiedTopology: true,
//     });
//     await client
//       .db(testDatabaseName)
//       .dropDatabase()
//       .then(() => console.log('User database dropped'));
//     await userDatabaseRepository.closeConnection();
//     await client.close();
//   });
//   describe('SignUp', () => {
//     it('Correct sign up. Should create a new user in the database and return 200 with the token as a cookie', (done) => {
//       chai
//         .request(server)
//         .post(signUpPath)
//         .send(user)
//         .end((_error, result) => {
//           expect(result.status).to.equal(200);
//           expect(result.body).not.to.be.empty;
//           expect(result.body).to.have.property('success');
//           done();
//         });
//     });

//     it('Incorrect sign up. Should try to create a new user with an existing username. Return 403 with a message in the body', (done) => {
//       chai
//         .request(server)
//         .post(signUpPath)
//         .send(preSave)
//         .end((_error, result) => {
//           expect(result.status).to.equal(403);
//           expect(result.body).not.to.be.empty;
//           expect(result.body).to.be.deep.equal({
//             error: 'Username already exits',
//           });
//           done();
//         });
//     });
//   });

//   describe('Login', () => {
//     it('Correct login. Should return 200 and with the token as a cookie', (done) => {
//       chai
//         .request(server)
//         .post(logInPath)
//         .send(logInUser)
//         .end((_error, result) => {
//           expect(result.status).to.equal(200);
//           expect(result.body).not.to.be.empty;
//           expect(result.body).to.have.property('success');
//           done();
//         });
//     });
//     it('Incorrect password for existing user. Should return 403 with a message in the body', (done) => {
//       chai
//         .request(server)
//         .post(logInPath)
//         .send({ user: 'a', pass: 'b' })
//         .end((_error, result) => {
//           expect(result.status).to.equal(403);
//           expect(result.body).not.to.be.empty;
//           expect(result.body).to.be.deep.equal({
//             error: 'User or password incorrect',
//           });
//           done();
//         });
//     });
//     it('Incorrect user. Should return 403 with a message in the body', (done) => {
//       chai
//         .request(server)
//         .post(logInPath)
//         .send({ user: 'b', pass: 'a' })
//         .end((_error, result) => {
//           expect(result.status).to.equal(403);
//           expect(result.body).not.to.be.empty;
//           expect(result.body).to.be.deep.equal({
//             error: 'User or password incorrect',
//           });
//           done();
//         });
//     });
//   });
// });
