/** @format */

import Device from '../../core/entities/Device';
import SmartPlug from '../../core/entities/SmartPlug';

export interface InteractorResponse {
  statusCode: number;
  value: string | object;
}
export interface ParsedConsumptionResponse {
  monthData: number[][];
  weekData: number[][];
  yesterdayData: number[][];
  todayData: number[][];
}

export interface ProfileResponse {
  username: string;
  anonymous: boolean;
  devices: Device[];
  smartPlug: SmartPlug;
}
