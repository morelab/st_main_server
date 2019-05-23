'use strict';

const router = require('express').Router();

const { controlSmartplug } = require('../../controllers');

router.get('/smartplugs/on/:id?', controlSmartplug);
router.get('/smartplugs/off/:id?', controlSmartplug);

module.exports = router;
