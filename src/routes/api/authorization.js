'use strict';

const router = require('express').Router();

const { createUser } = require('../../controllers');

router.post('/users/', createUser);

module.exports = router;
