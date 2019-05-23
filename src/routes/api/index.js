'use strict';

const router = require('express').Router();
const information = require('./information');
const control = require('./control');
const auth = require('./authorization');

const routes = {
  '/information': information,
  '/control': control,
  '/auth': auth,
};

Object.keys(routes).forEach((route) => {
  router.use(route, routes[route]);
});

module.exports = router;


