'use strict';

const mongoConnection = require('./mongoConnector');

const createUser = (userData) => {
  /*
  * put code to call database here
  * this can be either an ORM model or code to call
  * the database through a driver or querybuilder
  * i.e.-
  INSERT INTO blogposts (user_name, blogpost_body)
  VALUES (user, content);
  */
  let mongoConnector = mongoConnection();


  return { value: 1 }; // just a dummy return as we aren't calling db right now
};

module.exports = {
  createUser,
};

