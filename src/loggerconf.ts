import express from 'express';
import { createLogger, format, transports } from 'winston';
import { isEmpty } from 'ramda';
import { inspect } from 'util';
const { combine, printf } = format;

// Custom logger that will be imported through our app
export let log;

// Custom logger formatter
const myFormat = printf(
  info => `${info.timestamp} - ${info.level}: ${info.message}`
);

// In order to create a custom logger, in order to know what's happening in our app
// let's use winston
export const initLogger = () => {
  const console = new transports.Console({
    level: 'info',
    handleExceptions: true
  });

  log = createLogger({
    format: combine(
      format.colorize(),
      format.timestamp(),
      format.prettyPrint(),
      myFormat
    ),
    transports: [console],
    exitOnError: false
  });
};

// Default messages in order to output HTTP Request data data arrives to our app
export const logger = (
  req: express.Request,
  _resp: express.Response,
  next: express.NextFunction
) => {
  log.info(`[ HTTP ${req.method} - ${req.originalUrl} - IP ${req.ip} ]
    ${
      !isEmpty(req.body)
        ? `With body: ${inspect(req.body, { showHidden: true, depth: null })}`
        : `With body: {}`
    }
    ${
      !isEmpty(req.params)
        ? `With params: ${inspect(req.params, {
            showHidden: true,
            depth: null
          })}`
        : `With params: {}`
    }`);
  return next();
};
