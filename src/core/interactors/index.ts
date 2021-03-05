/** @format */

import ConsumptionEquivalence from '../../dataSources/consumptionEquivalence.datasource';
import IoToadAPI from '../../dataSources/ioToadApi.datasource';
import SmartPlugEtcd from '../../dataSources/smartPlugsEtcd.datasource';
import UsersMongo from '../../dataSources/usersMongo.datasource';
import TokenAuthentication from '../../shared/services/authentication/tokenAuthentication.services';
import dashboardInteractor from './dashboard.interactors';
import logInInteractor from './logIn.interactors';
import privacyInteractor from './privacy.interactors';
import {
  deleteProfileInteractor,
  getProfileInteractor,
} from './profile.interactors';
import signUpInteractor from './signUp.interactors';
import smartPlugCommandInteractor from './smartPlugCommand.interactors';
import smartPlugValidationInteractor from './smartplugValidation.interactors';
import userCookieValidationInteractor from './userCookieValidation.interactor';

export const userDatabaseRepository = new UsersMongo();
const tokenRepository = new TokenAuthentication();
const smartPlugDatabaseRepository = new SmartPlugEtcd();
const consumptionEquivalenceRepository = new ConsumptionEquivalence();
const ioToadAPIRepository = new IoToadAPI();

export const LogInInteractor = logInInteractor(
  userDatabaseRepository,
  tokenRepository,
);
export const SignUpInteractor = signUpInteractor(
  userDatabaseRepository,
  tokenRepository,
  ioToadAPIRepository,
);
export const UserCookieValidationInteractor = userCookieValidationInteractor(
  tokenRepository,
);
export const SmartPlugValidationInteractor = smartPlugValidationInteractor(
  smartPlugDatabaseRepository,
  userDatabaseRepository,
);
export const DashboardInteractor = dashboardInteractor(
  userDatabaseRepository,
  tokenRepository,
  consumptionEquivalenceRepository,
  ioToadAPIRepository,
);

export const GetProfileInteractor = getProfileInteractor(
  tokenRepository,
  userDatabaseRepository,
);
export const DeleteProfileInteractor = deleteProfileInteractor(
  tokenRepository,
  userDatabaseRepository,
  ioToadAPIRepository,
);
export const PrivacyInteractor = privacyInteractor(
  userDatabaseRepository,
  tokenRepository,
);
export const SmartPlugCommandInteractor = smartPlugCommandInteractor(
  tokenRepository,
  userDatabaseRepository,
  ioToadAPIRepository,
);
