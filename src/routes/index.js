'use strict';

const router = require('express').Router();
const api = require('./api');

const routes = {
  '/api': api,
};

Object.keys(routes).forEach((route) => {
  router.use(route, routes[route]);
});

module.exports = router;
