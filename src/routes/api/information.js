'use strict';

const router = require('express').Router();

const { getUserConsumption } = require('../../controllers');

router.get('/rankings/:id?', getUserConsumption);
router.get('/consumptions/:id?', getUserConsumption);

module.exports = router;
