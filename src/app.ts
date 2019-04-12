import express from 'express';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import { log, initLogger, logger } from './loggerconf';
import { dbInit } from './config/database';
import * as routes from './routes';

initLogger();

const app = express();

dbInit();

app.use(logger);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Dynamically import all the routes specified in the routes folder
Object.keys(routes)
  .sort()
  .map(routeName => {
    log.info(`Mounting route: /${routeName}`);
    app.use(`/${routeName}`, routes[routeName]);
  });

module.exports = app;
