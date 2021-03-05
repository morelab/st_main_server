/** @format */

import { createLogger, format, transports, addColors } from 'winston';

const { combine, timestamp, json, colorize } = format;

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), json(), colorize()),
  transports: [
    new transports.File({ filename: './logs/error.log', level: 'error' }),
    new transports.File({ filename: './logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.simple(),
    }),
  );
}

if (process.env.NODE_ENV === 'test') {
  logger.removeAllListeners();
}

addColors({
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  debug: 'green',
});

export const myStream = {
  write: (text: string) => {
    logger.debug(text);
  },
};

export default logger;
