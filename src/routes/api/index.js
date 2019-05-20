'use strict';

const router = require('express').Router();
const information = require('./information');

const routes = {
  '/information': information,
};

Object.keys(routes).forEach((route) => {
  router.use(route, routes[route]);
});

module.exports = router;


