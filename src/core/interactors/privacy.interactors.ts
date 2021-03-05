/** @format */

import { InteractorResponse } from '../../shared/entities/Responses';
import {
  CODE_FORBIDDEN,
  CODE_INTERNAL_SERVER_ERROR,
  CODE_NOT_FOUND,
  CODE_OK,
} from '../../utils/httpCodes';
import User from '../entities/User';
import TokenRepository from '../repositories/token.repository';
import UserDatabaseRepository from '../repositories/userDatabase.repository';

const privacyInteractor = (
  userDatabaseRepository: UserDatabaseRepository,
  tokenRepository: TokenRepository,
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
  const updatedUser: boolean = await userDatabaseRepository.updateUserAnonymousById(
    user.id,
    user.anonymous,
  );
  if (!updatedUser) {
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

export default privacyInteractor;
