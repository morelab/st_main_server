/** @format */

import { sign, verify } from 'jsonwebtoken';
import { jwtIssuer, jwtSecret } from '../../../configuration/configuration';
import User from '../../../core/entities/User';
import TokenRepository from '../../../core/repositories/token.repository';
import logger from '../../../utils/logger';
import { VerifiedToken } from '../../entities/Token';

export default class TokenAuthentication implements TokenRepository {
  public generateToken = (user: User): string => {
    const jwt = sign(
      {
        iss: jwtIssuer,
        sub: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: 'jwt',
        iat: new Date().getTime() / 1000,
      },
      jwtSecret,
    );
    return jwt;
  };

  public validateToken = (token: string): string => {
    try {
      const decodedToken = <VerifiedToken>verify(token, jwtSecret);
      const userId = decodedToken.sub;
      return userId;
    } catch (error) {
      logger.error('Error occurred validating the token: ', error);
      return undefined;
    }
  };
}
