/** @format */

import axios from 'axios';
import {
  influxDatabaseName,
  influxPowerMeasurement,
  influxQueryUrl,
  smartPlugCommandUrl,
} from '../configuration/configuration';
import IoToadAPIRepository from '../core/repositories/ioToadApi.repository';
import IoToadResponse from '../shared/entities/IoToad';
import logger from '../utils/logger';

export default class IoToadAPI implements IoToadAPIRepository {
  public setSmartPlugState = async (
    id: string,
    state: number,
  ): Promise<boolean> => {
    const ioToadResponse = await axios
      .put(
        `${smartPlugCommandUrl}/${id}`,
        {
          payload: `{ "status": ${state} }`,
        },
        { headers: { 'Content-Type': 'application/json' } },
      )
      .then(() => true)
      .catch((error) => {
        logger.error(error);
        return false;
      });
    return ioToadResponse;
  };

  public getConsumption = async (
    id: string,
    startDate: number,
    endDate: number,
  ): Promise<[IoToadResponse]> => {
    const ioToadResponse = await axios
      .get(
        `${influxQueryUrl}/${influxDatabaseName}/${influxPowerMeasurement}?id=${id}&from=${startDate}&to=${endDate}`,
      )
      .then((response) => {
        const { data } = response;
        data.shift();
        return data;
      })
      .catch((error) => {
        logger.error(error);
        return undefined;
      });
    return ioToadResponse;
  };
}
