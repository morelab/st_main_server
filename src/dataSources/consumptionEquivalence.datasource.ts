/** @format */

import axios from 'axios';
import { consumptionEquivalenceUrl } from '../configuration/configuration';
import consumptionEquivalenceRepository from '../core/repositories/consumptionEquivalence.repository';
import logger from '../utils/logger';

export default class ConsumptionEquivalence
  implements consumptionEquivalenceRepository {
  public getSmartPlugConsumptionEquivalence = async (
    location: string,
  ): Promise<string> => {
    const equivalence = await axios
      .post(
        consumptionEquivalenceUrl,
        { ubicacion: location },
        { headers: { 'Content-Type': 'application/json' } },
      )
      .then((response) => {
        const { data } = response;
        const { msg } = data;
        return msg;
      })
      .catch((error) => {
        logger.error(error);
        return undefined;
      });
    return equivalence;
  };
}
