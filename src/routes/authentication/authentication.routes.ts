/** @format */

import express from 'express';
import {
  deleteCookie,
  logInController,
  signUpController,
} from '../../controllers/userAuthentication.controller';
import {
  smartPlugValidationController,
  userCookieValidationController,
} from '../../controllers/validation.controller';

const router = express.Router();

router.get('/cookie-validation', userCookieValidationController);
router.get('/delete-cookie', deleteCookie);
router.get('/logout', deleteCookie);
router.post('/login', logInController);
router.post('/new-account', signUpController);
router.post('/smartplug-validation', smartPlugValidationController);

export default router;
