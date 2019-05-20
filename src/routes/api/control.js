'use strict';

const router = require('express').Router();

const { getUserConsumption } = require('../../controllers');

router.put('/smartplugs/:id?', getUserConsumption);

module.exports = router;
