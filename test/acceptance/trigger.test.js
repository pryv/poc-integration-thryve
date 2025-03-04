/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
/*global describe, it */
const config = require('../../src/config.js'),
  request = require('superagent');


const should = require('should');
require('../../src/server');

const serverBasePath = 'http://' + config.get('server:ip') + ':' + config.get('server:port');

const testuser = config.get('test:users')[0];

describe('trigger', function () {

  it('Trigger ', function (done) {
    this.timeout(30000); // test takes ~25s for some reason
    request.post(serverBasePath + '/trigger')
      .set('Accept', 'application/json')
      .set('Accept-Charset', 'utf-8')
      .set('Accept-Encoding', 'gzip, deflate')
      .set('Content-Type', 'application/json')
      .send({
        "sourceUpdate": {
          "authenticationToken": testuser.thryveToken,
          "partnerUserID": "test",
          "dataSource": "8",
          "startTimestamp": "2019-08-21T21:17:00Z",
          "endTimestamp": (new Date).toISOString().split('.')[0] + 'Z',
          "updateType": "MINUTE"
        }
      })
      .end(function (err, res) {
        should.not.exist(err);
        done();
      });
  });


  it('Trigger Apple', function (done) {
    this.timeout(30000);
    request.post(serverBasePath + '/trigger')
      .set('Accept', 'application/json')
      .set('Accept-Charset', 'utf-8')
      .set('Accept-Encoding', 'gzip, deflate')
      .set('Content-Type', 'application/json')
      .send({
        "sourceUpdate": {
          "authenticationToken": testuser.thryveToken,
          "partnerUserID": "test",
          "dataSource": "9",
          "startTimestamp": "2019-08-14T16:43:00Z",
          "endTimestamp": (new Date).toISOString().split('.')[0] + 'Z',
          "updateType": "MINUTE"
        }
      })
      .end(function (err, res) {
        should.not.exist(err);
        done();
      });
  });
});
