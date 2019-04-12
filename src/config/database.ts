import { inspect } from 'util';
import { isNil } from 'ramda';
import { log } from '../loggerconf';
import { Client } from 'pg';

// Database connection Object
const dbConnection = {
  user: 'netinvoice',
  host: 'localhost',
  database: 'userManager',
  password: '',
  port: 5432
};

// Database client instance
export const dbClient = new Client(dbConnection);

// Function responsible for the database connection
export const dbInit = () => {
  try {
    log.info('[ SQL CONNECTION INIT ]');
    dbClient.connect();
    log.info('[ SQL CONNECTION SUCESSFULL ]');
  } catch (err) {
    log.error(`[ SQL CONNECTION ERROR ] - ${inspect(err)}`);
  }
};

// Abstraction in order to use the postgres database instance
// with custom logger and some data processing
export const db = async (query: string, params?: Array<any>) => {
  log.info(`[ SQL ] - \n ${query}`);
  log.info(`[ SQL PARAMS ] - \n ${inspect(params)}`);
  try {
    const { rows } = await dbClient.query(query, isNil(params) ? [] : params);
    return rows;
  } catch (err) {
    log.error(`[ SQL ERROR ] - ${inspect(err)}`);
    throw err;
  }
};
