'use strict';

const envs = require('envs');
const slackClient = require('../server/slackClient');
const service = require('../server/service');
const http = require('http');

const server = http.createServer(service);

const witToken = envs('WIT_TOKEN');
const slackToken = envs('SLACK_TOKEN');

const witClient = require('../server/witClient')(witToken);

const slackLogLevel = 'verbose'; //debug

const serviceRegistry = service.get('serviceRegistry');

const rtm = slackClient.init(slackToken, slackLogLevel, witClient, serviceRegistry);

rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000))

server.on('listening', function() {

	console.log(`lauriboi is listening on ${server.address().port} in ${service.get('env')} mode.`)

});