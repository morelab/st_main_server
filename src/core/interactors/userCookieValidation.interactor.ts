/** @format */

import { InteractorResponse } from '../../shared/entities/Responses';
import TokenAuthentication from '../../shared/services/authentication/tokenAuthentication.services';
import { CODE_FORBIDDEN, CODE_OK } from '../../utils/httpCodes';

const userCookieValidationInteractor = (
  tokenAuthentication: TokenAuthentication,
) => (token: string): InteractorResponse => {
  const userId: string = tokenAuthentication.validateToken(token);
  if (!userId) {
    return {
      statusCode: CODE_FORBIDDEN,
      value: { error: 'Invalid token' },
    };
  }
  return { statusCode: CODE_OK, value: { success: true } };
};

export default userCookieValidationInteractor;
