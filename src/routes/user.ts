import express from 'express';
import squel from 'squel';
import { inspect } from 'util';
import { logger, log } from '../loggerconf';
import { databaseError } from '../errors';
import { db } from '../config/database';
import { has, isNil, isEmpty } from 'ramda';
import { validator } from '../middlewares/validator';

const router = express.Router();
// Since some of our queries need to be dynamically created, let's use a query builder
const sqlBuilder = squel.useFlavour('postgres');

interface UserData {
  email: string;
  givenName: string;
  familyName: string;
}

router.use(logger);

/*
  Returns user data for a specific user if a id is given.
  Otherwise, return data for all users stored in the database
 */
router.get('/:id?', validator, async (req, res) => {
  const { id } = req.params; // id of the user to get the info from
  const params = [id];
  const query = sqlBuilder
    .select()
    .field('id')
    .field('email')
    .field('givenName')
    .field('familyName')
    .field('created')
    .from('Utilizador');

  if (!isNil(id)) {
    query.where('id = $1');
  }
  const data = !isNil(id)
    ? await db(query.toString(), params)
    : await db(query.toString());
  res.send(data);
});

/*
  Enables the creation of a new user in the database
 */
router.post('/', validator, async (req, res) => {
  const validationResults = await req.getValidationResult();
  console.log('VALIDATION RESULTS ISEMPTY', validationResults.isEmpty());
  const { email, givenName, familyName }: UserData = req.body;
  const query = sqlBuilder
    .insert()
    .into('Utilizador')
    .set('email', '$1', { dontQuote: true })
    .set('givenName', '$2', { dontQuote: true })
    .set('familyName', '$3', { dontQuote: true });

  const params = [email, givenName, familyName];

  try {
    await db(query.toString(), params);
    res.sendStatus(200);
  } catch (err) {
    log.error(`USER CREATION ERROR : ${inspect(err)}`);
    if (!isNil(err) && has('constraint', err) && !isNil(err.constraint)) {
      res.status(409).json({ message: databaseError(err.constraint) });
    } else {
      res.status(500).json({ message: 'Error while creating user' });
    }
  }
});

/*
  Updates data of an existing user in the database
  I'll asume that the user data will be update in it's entirity or not,
  that's why the PUT method
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params; // id of the user to to update the data
  if (isEmpty(req.body)) {
    res.status(500).json('Body is empty');
  } else {
    const params = [id];
    const query = sqlBuilder
      .update()
      .table('Utilizador')
      .where(`id = $1`);

    try {
      // Dinamically create the query and the params array
      // based on the request body that we received
      Object.keys(req.body).forEach((key, index) => {
        query.set(`${key}`, `$${index + 2}`, { dontQuote: true });
        params.push(req.body[key]);
      });

      await db(query.toString(), params);
      res.sendStatus(200);
    } catch (err) {
      log.error(`ERROR WHILE UPDATING USER ${inspect(err)}`);
      if (!isNil(err) && has('constraint', err) && !isNil(err.constraint)) {
        res.status(409).json({ message: databaseError(err.constraint) });
      } else {
        res.status(500).json({ message: 'Error while creating user' });
      }
    }
  }
});

/*
  Deletes an existing user from the database
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // id of the user to remove from the database
  const params = [id];
  const query = sqlBuilder
    .delete()
    .from('Utilizador')
    .where('id = $1');

  try {
    await db(query.toString(), params);
    res.sendStatus(200);
  } catch (err) {
    log.error('ERROR WHILE DELETING USER');
    res.status(500).json({ message: 'Error while deleting user' });
  }
});

export default router;
