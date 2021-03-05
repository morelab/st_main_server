/** @format */

import User from '../entities/User';

export default interface TokenRepository {
  generateToken(user: User): string;
  validateToken(token: String): string;
}
