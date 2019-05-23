'use strict';

const Influx = require('influx');
const influx = require('./influxConnector');

const userConsumption = (user_id, start, end) => {
  /*
  * put code to call database here
  * this can be either an ORM model or code to call
  * the database through a driver or querybuilder
  * i.e.-
  INSERT INTO blogposts (user_name, blogpost_body)
  VALUES (user, content);
  */
  let queryString = `
  select MEAN("value") from "consumption"
  where "sentient_user_id" = '${user_id}'
  AND time >= '${start}'
  GROUP BY time(15m) fill(previous)
 `;

  // TODO: use influx ltieral values class
  return influx.query(queryString);

};

const usersConsumption = (start, end) => {
  /*
  * put code to call database here
  * this can be either an ORM model or code to call
  * the database through a driver or querybuilder
  * i.e.-
  INSERT INTO blogposts (user_name, blogpost_body)
  VALUES (user, content);
  */


  let queryString = `
  SELECT MEAN("mean")
  FROM
  (
   select MEAN("value") from "consumption"
   WHERE time >= '${start}'
   GROUP BY time(15m), sentient_user_id fill(previous)
  )
  GROUP BY sentient_user_id
`;
  // TODO: use influx ltieral values class
  return influx.query(queryString);

};

module.exports = {
  userConsumption,
  usersConsumption,
};

