'use strict';

const service = require('../services');

const { findWithAttr } = require('../utils/utils');

/*
* call other imported services, or same
service but different functions here if you need to
*/
const getUserConsumption = async(req, res, next) => {
  try {
    let response = await service.queryUserConsumption(req.params.id, req.start, req.end);
    let sum = response.reduce((partial_sum, value_partial) => partial_sum + value_partial['mean'], 0);
    let consumption_ph = sum / response.length;
    console.log(consumption_ph);

    try {
      if (consumption_ph.isNan()) {
        res.sendStatus(404) && next('Resource not found');
      }
      response = { value: consumption_ph, unit: 'Wh' };
    } catch (e) {
      console.log(e.message);
      res.sendStatus(404) && next(e);
    }

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

const getUserRanking = async(req, res, next) => {
  try {
    let response = await service.queryUsersConsumption(req.start, req.end);
    let ordered_ranking = response.sort((a, b) => parseFloat(a.mean) - parseFloat(b.mean));
    let user_ranking = findWithAttr(ordered_ranking, 'sentient_user_id', req.params.id);

    try {
      if (user_ranking === -1) {
        res.sendStatus(404) && next('Resource not found');
      }
      response = {
        place: user_ranking, unit: 'Wh',
        total: ordered_ranking.length,
        percentile: (user_ranking * 100 / ordered_ranking.length),
      };
    } catch (e) {
      console.log(e.message);
      res.sendStatus(404) && next(e);
    }

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

const controlSmartplug = async(req, res, next) => {
  try {
    let response = await service.createUser(req.body);

    res
      .status(200)
      .json(response);
    next();
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500) && next(e);
  }
};

const createUser = async(req, res, next) => {
  try {
    let response = await service.createUser(req.body);
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

const loginUser = async(req, res, next) => {
  try {
    let response = await service.queryUserConsumption(req.params.id);
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
  getUserRanking,
  controlSmartplug,
  createUser,
  loginUser,
};
