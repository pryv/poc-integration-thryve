/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
const express = require('express');
const config = require('./config.js');
const app = express();
app.use(require('body-parser').json());

const user = require('./user.js');
const thryve = require('./thryve.js');
const storage = require('./storage.js');

const port = config.get('server:port');

app.get('/', (req, res) => res.send('Hello World!'));

/**
 * Create a User
 */
app.post('/user', async (req, res) => {
  if(!req.body.pryvEndpoint || !req.body.thryveToken){
    res.status(400).send('Check pryvEndpoint and thryveToken fields');
  }
  storage.addUser(req.body.pryvEndpoint, req.body.thryveToken);
  await user.initUser({ pryvEndpoint: req.body.pryvEndpoint, thryveToken: req.body.thryveToken});
  res.send({result: 'OK'})
});

/**
 * Get Thryve status froma Pryv User endpoint
 */
app.get('/user/thryve', async (req, res) => {
  try {
    const dbres = storage.tokenForPryvEndpoint(req.query.pryvEndpoint);
    if (! dbres) {
      return res.status(404).send({ error: 'User unkown' });
    }
    const result = await thryve.userInfo(dbres.thryveToken);
    if (result && result.text && result.body && result.body[0]) {
      return res.send({ result: result.body[0] });
    }
    console.warn(result);
    return res.status(500).send('ERROR');
  } catch (e) {
    res.status(500).send('ERROR');
    console.warn(e);
  }
});

/**
 * Handle EventTrigger from Thryve backend
 */
app.post('/trigger', async (req, res) => {
  try {
    const result = await user.handleTrigger(req.body);
    return res.status(200).send({result: 'OK'});
  } catch (error) {
    console.log('Error Trigger Res: ', error);
    res.status(500).send('Something broke!');
  }
});

/**
 * Not used yet
 */
app.post('/auto', async (req, res) => {
  try {
    storage.addSyncSourceForUser(req.body.pryvEndpoint, req.body.source);
    res.status(200).send({result: 'OK'});
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => console.log(`Thryve <> Pryv bridge listening on port ${port}!`))
