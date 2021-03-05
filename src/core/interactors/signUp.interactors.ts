/** @format */

import { v4 as uuid } from 'uuid';
import { InteractorResponse } from '../../shared/entities/Responses';
import {
  CODE_FAILED_DEPENDENCY,
  CODE_FORBIDDEN,
  CODE_INTERNAL_SERVER_ERROR,
  CODE_OK,
} from '../../utils/httpCodes';
import logger from '../../utils/logger';
import Device from '../entities/Device';
import Profile from '../entities/Profile';
import SmartPlug from '../entities/SmartPlug';
import User from '../entities/User';
import IoToadAPIRepository from '../repositories/ioToadApi.repository';
import TokenRepository from '../repositories/token.repository';
import UserDatabaseRepository from '../repositories/userDatabase.repository';

const signUpInteractor = (
  userDatabaseRepository: UserDatabaseRepository,
  tokenRepository: TokenRepository,
  ioToadAPIRepository: IoToadAPIRepository,
) => async (
  username: string,
  password: string,
  anonymous: boolean,
  name: string,
  priv: number,
  profile: Profile,
  devices: Device[],
  smartPlug: SmartPlug,
): Promise<InteractorResponse> => {
  const userWithUsername: User = await userDatabaseRepository.getUserByUsername(
    username,
  );
  if (userWithUsername) {
    logger.error('Username is already stored in the database');
    return {
      statusCode: CODE_FORBIDDEN,
      value: { error: 'Username already exists' },
    };
  }
  const user: User = {
    id: uuid(),
    username,
    password,
    anonymous,
    name,
    priv,
    profile,
    devices,
    smartPlug,
  };
  const userStored: boolean = await userDatabaseRepository.saveUser(user);
  if (!userStored) {
    return {
      statusCode: CODE_INTERNAL_SERVER_ERROR,
      value: { error: 'An error ocurred saving the user, try again later' },
    };
  }
  const userSmartPlugStateOn = await ioToadAPIRepository.setSmartPlugState(
    user.smartPlug.location,
    1,
  );
  if (!userSmartPlugStateOn) {
    return {
      statusCode: CODE_FAILED_DEPENDENCY,
      value: { error: 'Error with IoToad' },
    };
  }
  const token: string = tokenRepository.generateToken(user);

  return { statusCode: CODE_OK, value: token };
};

export default signUpInteractor;
