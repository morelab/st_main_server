/** @format */

import { InteractorResponse } from '../../shared/entities/Responses';
import {
  CODE_FORBIDDEN,
  CODE_NOT_ACCEPTABLE,
  CODE_OK,
} from '../../utils/httpCodes';
import logger from '../../utils/logger';
import SmartPlugDatabaseRepository from '../repositories/smartPlugDatabase.repository';
import UserDatabaseRepository from '../repositories/userDatabase.repository';

const smartPugValidationInteractor = (
  smartPlugDatabaseRepository: SmartPlugDatabaseRepository,
  userDatabaseRepository: UserDatabaseRepository,
) => async (location: string): Promise<InteractorResponse> => {
  const smartPlugUserId = await smartPlugDatabaseRepository.getSmartPlugUserIdById(
    location,
  );
  logger.info(smartPlugUserId);
  if (!smartPlugUserId) {
    return {
      statusCode: CODE_NOT_ACCEPTABLE,
      value: { error: 'SmartPlug location not found' },
    };
  }
  const user = await userDatabaseRepository.getUserBySmartPlugLocation(
    location,
  );
  if (user) {
    return {
      statusCode: CODE_FORBIDDEN,
      value: { error: 'SmartPlug location already assigned to other user' },
    };
  }
  return { statusCode: CODE_OK, value: smartPlugUserId };
};

export default smartPugValidationInteractor;
