'use strict';

const { userConsumption } = require('../db/influxDB');

/*
* if you need to make calls to additional tables,
data stores (Redis, for example),
* or call an external endpoint as part
of creating the blogpost, add them to this service
*/
const queryUserConsumption = async(user_id) => {
  try {
    return await userConsumption(user_id);
  } catch (e) {
    throw new Error(e.message);
  }
};

module.exports = {
  queryUserConsumption,
};
