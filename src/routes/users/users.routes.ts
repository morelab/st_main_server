/** @format */
import express from 'express';
import {
  deleteProfileController,
  getProfileController,
  privacyController,
} from '../../controllers/user.controller';

const router = express.Router();
router.get('/profile', getProfileController);
router.delete('/profile', deleteProfileController);
router.get('/privacy', privacyController);

export default router;
