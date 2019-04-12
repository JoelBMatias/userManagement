import test from 'ava';
import { omit } from 'ramda';
import request from 'supertest';
import { db } from '../../../dest/config/database';
import {
  userDataFirst,
  userDataSecond,
  userDataThird,
  userDataUpdate,
  userDataUpdateConflict,
  specificUserData,
  allUserData
} from '../../data/user.js';
const app = require('../../../dest/app');

/*
  For the scope of this project we are using the same DB for the tests and
  and running the app, in a real world project the test DB would be a copy
  of the Prod DB.
  So let's clean what ever is in the DB in order to run the tests
 */
test.before(async t => {
  await db('DELETE FROM Utilizador');
  await db('ALTER SEQUENCE utilizador_id_seq RESTART WITH 1');
});

test.serial('User Creation', async t => {
  const response = await request(app)
    .post('/user')
    .send(userDataFirst);
  t.is(response.status, 200);
});

test.serial('User Creation (another user 2)', async t => {
  const response = await request(app)
    .post('/user')
    .send(userDataSecond);
  t.is(response.status, 200);
});

test.serial('User Creation (another user 3)', async t => {
  const response = await request(app)
    .post('/user')
    .send(userDataThird);
  t.is(response.status, 200);
});

test.serial('User creation conflicts email', async t => {
  const response = await request(app)
    .post('/user')
    .send(userDataFirst);

  t.is(response.status, 409);
});

test.serial('User update', async t => {
  const response = await request(app)
    .put(`/user/${userDataUpdate.id}`)
    .send({ ...omit(['id'], userDataUpdate) });

  t.is(response.status, 200);
});

test.serial(
  'User update conlicts (Try to update a user email to an email of an existing user)',
  async t => {
    const response = await request(app)
      .put(`/user/${userDataUpdateConflict.id}`)
      .send({ ...omit(['id'], userDataUpdateConflict) });

    t.is(response.status, 409);
  }
);

test.serial('User deletion', async t => {
  const response = await request(app).delete(`/user/1`);

  t.is(response.status, 200);
});

test.serial('Get specific user data', async t => {
  const response = await request(app).get('/user/2');
  t.is(response.status, 200);
  const userDataProcessed = response.body.map(elem => omit(['created'], elem));
  t.deepEqual(userDataProcessed, specificUserData);
});

test.serial('Get all users information', async t => {
  const response = await request(app).get('/user');
  const userDataProcessed = response.body.map(elem => omit(['created'], elem));
  t.is(response.status, 200);
  t.deepEqual(userDataProcessed, allUserData);
});
