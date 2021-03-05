/** @format */

import lodash from 'lodash';
import { arrayMaxValue } from '../../../configuration/configuration';
import IoToadResponse from '../../entities/IoToad';
import { ParsedConsumptionResponse } from '../../entities/Responses';

const getArrayChunkSize = (arrayLength: number): number => {
  const jump = Math.ceil(arrayLength / arrayMaxValue);
  return jump;
};

const parseChunks = (consumptionInChunks: IoToadResponse[][]): number[][] => {
  const parsedData = consumptionInChunks.map((chunk) => {
    const chunkHead = lodash.head(chunk);
    const parsedChunk = [Math.ceil(Number(chunkHead.t) / 1000000), chunkHead.v];
    return parsedChunk;
  });
  return parsedData;
};

const consumptionArrayParser = (
  todayConsumption: IoToadResponse[],
  yesterdayConsumption: IoToadResponse[],
  weekConsumption: IoToadResponse[],
  monthConsumption: IoToadResponse[],
): ParsedConsumptionResponse => {
  const todayConsumptionChunkSize = getArrayChunkSize(todayConsumption.length);
  const yesterdayConsumptionChunkSize = getArrayChunkSize(
    yesterdayConsumption.length,
  );
  const weekConsumptionChunkSize = getArrayChunkSize(weekConsumption.length);
  const monthConsumptionChunkSize = getArrayChunkSize(monthConsumption.length);
  const todayConsumptionInChunks = lodash.chunk(
    todayConsumption,
    todayConsumptionChunkSize,
  );
  const todayConsumptionParsed: number[][] = parseChunks(
    todayConsumptionInChunks,
  );
  const yesterdayConsumptionInChunks = lodash.chunk(
    yesterdayConsumption,
    yesterdayConsumptionChunkSize,
  );
  const yesterdayConsumptionParsed: number[][] = parseChunks(
    yesterdayConsumptionInChunks,
  );
  const weekConsumptionInChunks = lodash.chunk(
    weekConsumption,
    weekConsumptionChunkSize,
  );
  const weekConsumptionParsed: number[][] = parseChunks(
    weekConsumptionInChunks,
  );
  const monthConsumptionInChunks = lodash.chunk(
    monthConsumption,
    monthConsumptionChunkSize,
  );
  const monthConsumptionParsed: number[][] = parseChunks(
    monthConsumptionInChunks,
  );
  const allConsumptionsParsed: ParsedConsumptionResponse = {
    todayData: todayConsumptionParsed,
    yesterdayData: yesterdayConsumptionParsed,
    weekData: weekConsumptionParsed,
    monthData: monthConsumptionParsed,
  };
  return allConsumptionsParsed;
};
export default consumptionArrayParser;
