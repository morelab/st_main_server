'use strict';

const influxDB = require('../db/influxDB');
const mongoDB = require('../db/mongoDB');

/*
* if you need to make calls to additional tables,
data stores (Redis, for example),
* or call an external endpoint as part
of creating the blogpost, add them to this service
*/
const queryUserConsumption = async(user_id, start, end) => {
  try {
    return await influxDB.userConsumption(user_id, start, end);
  } catch (e) {
    throw new Error(e.message);
  }
};

const queryUsersConsumption = async(start, end) => {
  try {
    return await influxDB.usersConsumption(start, end);
  } catch (e) {
    throw new Error(e.message);
  }
};


/*
* if you need to make calls to additional tables,
data stores (Redis, for example),
* or call an external endpoint as part
of creating the blogpost, add them to this service
*/
const createUser = async(userData) => {
  try {
    return await mongoDB.createUser(userData);
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  queryUserConsumption,
  queryUsersConsumption,
  createUser,
};
