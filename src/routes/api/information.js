'use strict';

const router = require('express').Router();

const { getUserConsumption, getUserRanking } = require('../../controllers');
const { datesHour, datesToday, datesDay, datesWeek,
  datesMonth, datesForever } = require('../../utils/utils');

router.get('/rankings/today/:id?', datesToday, getUserRanking);
router.get('/rankings/day/:id?', datesDay, getUserRanking);
router.get('/rankings/week/:id?', datesWeek, getUserRanking);
router.get('/rankings/historical/:id?', datesForever, getUserRanking);
router.get('/rankings/month/:id?', datesMonth, getUserRanking);

router.get('/consumptions/hour/:id?', datesHour, getUserConsumption);
router.get('/consumptions/today/:id?', datesToday, getUserConsumption);
router.get('/consumptions/day/:id?', datesDay, getUserConsumption);
router.get('/consumptions/week/:id?', datesWeek, getUserConsumption);
router.get('/consumptions/month/:id?', datesMonth, getUserConsumption);
router.get('/consumptions/historical/:id?', datesForever, getUserConsumption);


module.exports = router;
