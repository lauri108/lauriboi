'use strict';

const request = require('superagent');

module.exports.process = function process(intentData, registry, cb){

	if(intentData.intent[0].value != 'greeting')
		return cb(new Error(`Expected greeting intent, got ${intentData.intent[0].value}`));

	//TODO: get more greetings up here

	var greetings = ["Hi there.", "Hello there.", "Greetings.", "'ello.", "Sup mate?", "Ahoy!", "Arr, pirates.. I'm such a dork :-S"];
	var random = Math.floor(Math.random() * greetings.length);

	const greeting = greetings[random];

	return cb(false, `${greeting}`);

}