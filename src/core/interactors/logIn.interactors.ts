/** @format */

import { InteractorResponse } from '../../shared/entities/Responses';
import { CODE_FORBIDDEN, CODE_OK } from '../../utils/httpCodes';
import logger from '../../utils/logger';
import User from '../entities/User';
import TokenRepository from '../repositories/token.repository';
import DatabaseRepository from '../repositories/userDatabase.repository';

const logInInteractor = (
  userDatabaseRepository: DatabaseRepository,
  tokenRepository: TokenRepository,
) => async (
  username: string,
  password: string,
): Promise<InteractorResponse> => {
  const user: User = await userDatabaseRepository.getUserByUsername(username);
  if (!user) {
    return {
      statusCode: CODE_FORBIDDEN,
      value: { error: 'User or password incorrect' },
    };
  }
  const validUser: boolean = await userDatabaseRepository.validateUser(
    user,
    password,
  );
  if (!validUser) {
    logger.error('User and password do not match');
    return {
      statusCode: CODE_FORBIDDEN,
      value: { error: 'User or password incorrect' },
    };
  }
  const token: string = tokenRepository.generateToken(user);
  return { statusCode: CODE_OK, value: token };
};

export default logInInteractor;
