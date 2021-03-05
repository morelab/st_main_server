/** @format */

import axios from 'axios';
import {
  etcdUrl,
  etcdUrlPath,
  testEtcdUrlPath,
} from '../configuration/configuration';
import smartPlugDatabaseRepository from '../core/repositories/smartPlugDatabase.repository';
import logger from '../utils/logger';

export default class SmartPlugEtcd implements smartPlugDatabaseRepository {
  public getSmartPlugUserIdById = async (id: string): Promise<string> => {
    let etcdDatabaseUrl;
    if (process.env.NODE_ENV !== 'test') {
      etcdDatabaseUrl = `${etcdUrl + etcdUrlPath}id_to_userid/${id}`;
    } else {
      etcdDatabaseUrl = `${etcdUrl + testEtcdUrlPath}id_to_userid/${id}`;
    }

    const userId: string = await axios
      .get(etcdDatabaseUrl)
      .then((response) => {
        const { data } = response;
        const smartPlugUserId: string = data.node.value;
        return smartPlugUserId;
      })
      .catch((error) => {
        logger.error(error);
        return undefined;
      });
    return userId;
  };
}
