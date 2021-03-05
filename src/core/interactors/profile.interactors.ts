/** @format */

import {
  InteractorResponse,
  ProfileResponse,
} from '../../shared/entities/Responses';
import {
  CODE_FAILED_DEPENDENCY,
  CODE_FORBIDDEN,
  CODE_INTERNAL_SERVER_ERROR,
  CODE_NOT_FOUND,
  CODE_OK,
} from '../../utils/httpCodes';
import User from '../entities/User';
import IoToadAPIRepository from '../repositories/ioToadApi.repository';
import TokenRepository from '../repositories/token.repository';
import UserDatabaseRepository from '../repositories/userDatabase.repository';

export const getProfileInteractor = (
  tokenRepository: TokenRepository,
  userDatabaseRepository: UserDatabaseRepository,
) => async (token: string): Promise<InteractorResponse> => {
  const userId = tokenRepository.validateToken(token);
  if (!userId) {
    return Promise.resolve({
      statusCode: CODE_FORBIDDEN,
      value: { error: 'Invalid token' },
    });
  }
  const user: User = await userDatabaseRepository.getUserById(userId);
  if (!user) {
    return {
      statusCode: CODE_NOT_FOUND,
      value: { error: 'User could not be found in the database' },
    };
  }
  if (!user.anonymous) {
    const profile: ProfileResponse = {
      username: user.name,
      anonymous: user.anonymous,
      smartPlug: user.smartPlug,
      devices: user.devices,
    };
    return {
      statusCode: CODE_OK,
      value: { user: profile },
    };
  }

  const profile: ProfileResponse = {
    username: user.smartPlug.name,
    anonymous: user.anonymous,
    smartPlug: user.smartPlug,
    devices: user.devices,
  };
  return {
    statusCode: CODE_OK,
    value: { user: profile },
  };
};

export const deleteProfileInteractor = (
  tokenRepository: TokenRepository,
  userDatabaseRepository: UserDatabaseRepository,
  ioToadAPIRepository: IoToadAPIRepository,
) => async (token: string): Promise<InteractorResponse> => {
  const userId = tokenRepository.validateToken(token);
  if (!userId) {
    return Promise.resolve({
      statusCode: CODE_FORBIDDEN,
      value: { error: 'Invalid token' },
    });
  }
  const user: User = await userDatabaseRepository.getUserById(userId);
  if (!user) {
    return {
      statusCode: CODE_NOT_FOUND,
      value: { error: 'User could not be found in the database' },
    };
  }
  const userSmartPlugStateOff = await ioToadAPIRepository.setSmartPlugState(
    user.smartPlug.location,
    0,
  );
  if (!userSmartPlugStateOff) {
    return {
      statusCode: CODE_FAILED_DEPENDENCY,
      value: { error: 'Error with IoToad' },
    };
  }
  const userDeleted: boolean = await userDatabaseRepository.deleteUserById(
    userId,
  );
  if (!userDeleted) {
    return {
      statusCode: CODE_INTERNAL_SERVER_ERROR,
      value: { error: 'The user did not delete properly. Try again' },
    };
  }

  return {
    statusCode: CODE_OK,
    value: { success: true },
  };
};
