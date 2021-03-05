/** @format */

import IoToadResponse from '../../shared/entities/IoToad';

export default interface IoToadAPIRepository {
  getConsumption(
    id: string,
    startDate: number,
    endDate: number,
  ): Promise<[IoToadResponse]>;
  setSmartPlugState(id: string, state: number): Promise<boolean>;
}
