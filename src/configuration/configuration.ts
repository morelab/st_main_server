/** @format */

import dotenv from 'dotenv';

dotenv.config();

// Server configuration
export const port: string | number = process.env.PORT ?? 8080;
export const arrayMaxValue: number = 500;

// Authentication
export const authenticationCookieName: string = 'access_token';
export const jwtIssuer: string = process.env.JWT_ISSUER ?? 'test';
export const jwtSecret: string = process.env.JWT_SECRET ?? 'test';

// User database
export const databaseCollection: string = 'users';
export const databaseName: string = 'st';
export const databaseUrl: string =
  process.env.MONGOURL ?? 'mongodb://localhost:27017';
export const testDatabaseName: string = 'st_test';

// SmartPlugs database
export const etcdUrl: string = process.env.ETCDURL ?? 'http://localhost:2379';
export const etcdUrlPath: string = '/v2/keys/smartplugs/';
export const testEtcdUrlPath: string = '/v2/keys/test_smartplugs/';

// IoToad
export const influxQueryUrl: string = process.env.INFLUXQUERYURL;
export const influxDatabaseName: string = process.env.INFLUXDBNAME;
export const influxStatusMeasurement: string = process.env.INFLUXSTATUS;
export const influxPowerMeasurement: string = process.env.INFLUXPOWER;
export const smartPlugCommandUrl: string = process.env.SPCOMMANDURL;

// Equivalences
export const consumptionEquivalenceUrl = process.env.EQUIVALENCEURL;
