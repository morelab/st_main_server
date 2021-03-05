/** @format */

import express from 'express';
import {
  dashboardController,
  smartPlugCommand,
} from '../../controllers/application.controller';

const router = express.Router();

router.get('/dashboard', dashboardController);
router.get('/smartplug-command', smartPlugCommand);
export default router;
