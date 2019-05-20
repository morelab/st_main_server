'use strict';

const { queryUserConsumption } = require('../services');

/*
* call other imported services, or same
service but different functions here if you need to
*/
const getUserConsumption = async(req, res, next) => {
  console.log(req.params.id);
  try {
    let response = await queryUserConsumption(req.params.id);
    // other service call (or same service, different function can go here)
    // i.e. - await generateBlogpostPreview()
    res
      .status(200)
      .json(response);
    next();
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500) && next(e);
  }
};

module.exports = {
  getUserConsumption,
};
