'use strict';

const request = require('superagent');

module.exports.process = function process(intentData, registry, cb){

	if(intentData.intent[0].value != 'time')
		return cb(new Error(`Expected time intent, got ${intentData.intent[0].value}`));

	if(!intentData.location) 
		return cb(new Error(`Missing location in time intent`));
	
	// sometimes the bot name ends up in the location string. This regexp removes it. 
	const locationReplacedString = intentData.location[0].value.replace(/,* *[Ll]auriboi\?*/g, "");
	
	const location = locationReplacedString;

	const service = registry.get('time');

	if(!service) return cb(false, `I'm sorry, but the service I use to get time is not working. Please try again later.`);

	request.get(`http://${service.ip}:${service.port}/service/${location}`, (err, res) => {

		if(err || res.statusCode != 200 || !res.body.result){
			console.log(err);
			return cb(false, `I had a problem finding out the time in "${location}". Maybe I'm not getting the location right? Help me out here..`);
		}

		return cb(false, `In ${location}, it is now ${res.body.result}`);
	});

}