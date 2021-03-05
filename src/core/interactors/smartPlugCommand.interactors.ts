/** @format */

import { InteractorResponse } from '../../shared/entities/Responses';
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

const smartPlugCommandInteractor = (
  tokenRepository: TokenRepository,
  databaseRepository: UserDatabaseRepository,
  ioToadAPIRepository: IoToadAPIRepository,
) => async (token: string): Promise<InteractorResponse> => {
  const userId = tokenRepository.validateToken(token);
  if (!userId) {
    return Promise.resolve({
      statusCode: CODE_FORBIDDEN,
      value: { error: 'Invalid token' },
    });
  }
  const user: User = await databaseRepository.getUserById(userId);
  if (!user) {
    return {
      statusCode: CODE_NOT_FOUND,
      value: { error: 'User could not be found in the database' },
    };
  }
  const newSmartPlugState = user.smartPlug.in_use ? 0 : 1;
  const smartPlugStatusChanged: boolean = await ioToadAPIRepository.setSmartPlugState(
    user.smartPlug.location,
    newSmartPlugState,
  );
  if (!smartPlugStatusChanged) {
    return {
      statusCode: CODE_FAILED_DEPENDENCY,
      value: { error: 'Error with IoToad' },
    };
  }
  const updatedUserSmartplug: boolean = await databaseRepository.updateUserSmartPlugInUseById(
    user.id,
    user.smartPlug,
  );
  if (!updatedUserSmartplug) {
    return {
      statusCode: CODE_INTERNAL_SERVER_ERROR,
      value: { error: 'Error in user update' },
    };
  }
  return {
    statusCode: CODE_OK,
    value: { success: true },
  };
};
export default smartPlugCommandInteractor;
