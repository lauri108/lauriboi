'use strict';

const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

let rtm = null;
let nlp = null;
let registry = null;

function handleOnAuthenticated(rtmStartData){
	console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function handleOnMessage(message){

	if(message.text && message.text.toLowerCase().includes('lauriboi')) {

		nlp.ask(message.text, (err, res) => {

			if(err){
				console.log(err);
				return;
			}

			try {
				
				if(!res.intent || !res.intent[0] || !res.intent[0].value) {
					throw new Error("Could not extract intent.");
				}

				const intent = require('./intents/' + res.intent[0].value + 'Intent');

				intent.process(res, registry, function(error, response) {

					if(error) {
						console.log(error.message);
						return;
					}

					return rtm.sendMessage(response, message.channel)

				});


			} catch(err) {

				console.log(err);
				console.log(res);
			}
			
			if(!res.intent){
				return rtm.sendMessage("Mate, I'm still a bot in training. I didn't understand what you meant by that, but @lauri is gonna use https://wit.ai to tell me soon.", message.channel);

			} else if(res.intent[0].value == 'time' && res.location){
				//return rtm.sendMessage(`Gimme a sec, finding out the current time in ${res.location[0].value}`, message.channel);
			} else if(res.intent[0].value == 'status') {
				return rtm.sendMessage(`Thanks for asking, mate.`, message.channel);
			} else {
				console.log(res);
			}

		});
		
	}

}

function addAuthenticatedHandler(rtm, handler){
	rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler);
}

module.exports.init = function slackClient(token, logLevel, nlpClient, serviceRegistry) {

	rtm = new RtmClient(token, {logLevel: logLevel});
	nlp = nlpClient;
	registry = serviceRegistry;
	addAuthenticatedHandler(rtm, handleOnAuthenticated);
	rtm.on(RTM_EVENTS.MESSAGE, handleOnMessage);
	return rtm;

}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;

