'use strict';

const request = require('superagent');

module.exports.process = function process(intentData, registry, cb){

	if(intentData.intent[0].value != 'status')
		return cb(new Error(`Expected status intent, got ${intentData.intent[0].value}`));

	//TODO: get more statuses up here
	const status = "chillin'";

	return cb(false, `Right now, my status is ${status}.`);

}