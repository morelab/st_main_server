/** @format */

import ConsumptionEquivalence from '../../dataSources/consumptionEquivalence.datasource';
import IoToadResponse from '../../shared/entities/IoToad';
import {
  InteractorResponse,
  ParsedConsumptionResponse,
} from '../../shared/entities/Responses';
import consumptionArrayParser from '../../shared/services/app/consumptionArrayParser.service';
import {
  CODE_FAILED_DEPENDENCY,
  CODE_FORBIDDEN,
  CODE_NOT_FOUND,
  CODE_OK,
} from '../../utils/httpCodes';
import User from '../entities/User';
import IoToadAPIRepository from '../repositories/ioToadApi.repository';
import TokenRepository from '../repositories/token.repository';
import UserDatabaseRepository from '../repositories/userDatabase.repository';

const dashboardInteractor = (
  userDatabaseRepository: UserDatabaseRepository,
  tokenRepository: TokenRepository,
  consumptionEquivalenceRepository: ConsumptionEquivalence,
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
  const userSmartPlugLocation = user.smartPlug.location;

  const consumptionEquivalence = await consumptionEquivalenceRepository.getSmartPlugConsumptionEquivalence(
    userSmartPlugLocation,
  );
  if (!consumptionEquivalence) {
    return {
      statusCode: CODE_FAILED_DEPENDENCY,
      value: { error: 'Error with equivalence microservice' },
    };
  }

  const todayDate: Date = new Date();
  const yesterdayDate: Date = new Date(
    new Date().setDate(new Date().getDate() - 1),
  );
  const twoDaysAgoDate: Date = new Date(
    new Date().setDate(new Date().getDate() - 2),
  );
  const weekAgoDate: Date = new Date(
    new Date().setDate(new Date().getDate() - 7),
  );
  const thirtyDaysAgoDate: Date = new Date(
    new Date().setDate(new Date().getDate() - 30),
  );

  const todayTime: number = Math.floor(todayDate.getTime() / 1000);
  const yesterdayTime: number = Math.floor(yesterdayDate.getTime() / 1000);
  const twoDaysAgoTime: number = Math.floor(twoDaysAgoDate.getTime() / 1000);
  const weekAgoTime: number = Math.floor(weekAgoDate.getTime() / 1000);
  const thirtyDaysAgoTime: number = Math.floor(
    thirtyDaysAgoDate.getTime() / 1000,
  );

  const todayConsumption: [
    IoToadResponse,
  ] = await ioToadAPIRepository.getConsumption(
    userSmartPlugLocation,
    yesterdayTime,
    todayTime,
  );
  const yesterdayConsumption: [
    IoToadResponse,
  ] = await ioToadAPIRepository.getConsumption(
    userSmartPlugLocation,
    twoDaysAgoTime,
    yesterdayTime,
  );
  const weekConsumption: [
    IoToadResponse,
  ] = await ioToadAPIRepository.getConsumption(
    userSmartPlugLocation,
    weekAgoTime,
    todayTime,
  );
  const monthConsumption: [
    IoToadResponse,
  ] = await ioToadAPIRepository.getConsumption(
    userSmartPlugLocation,
    thirtyDaysAgoTime,
    todayTime,
  );
  if (
    !todayConsumption ||
    !yesterdayConsumption ||
    !weekConsumption ||
    !monthConsumption
  ) {
    return {
      statusCode: CODE_FAILED_DEPENDENCY,
      value: { error: 'Error fetching the user consumption' },
    };
  }
  const parsedConsumptions: ParsedConsumptionResponse = consumptionArrayParser(
    todayConsumption,
    yesterdayConsumption,
    weekConsumption,
    monthConsumption,
  );
  const returnValue = {
    todayData: parsedConsumptions.todayData,
    yesterdayData: parsedConsumptions.yesterdayData,
    weekData: parsedConsumptions.weekData,
    monthData: parsedConsumptions.monthData,
    user: true,
    equivalence: consumptionEquivalence,
  };
  return {
    statusCode: CODE_OK,
    value: returnValue,
  };
};

export default dashboardInteractor;
