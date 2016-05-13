'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');




module.exports = new Script({
    processing: {
        //prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say('So you want find some games to play? Just say HELLO to get started.')
                .then(() => 'speak');
        }
    },

    speak: {
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }
            
/* getReply should allow for some variety in responses for received text messages that 
do not have an entry in the scripts.json file. */
            function getReply() {
                var messages = [ "Sorry. I'm not configured with a response to your message. Try typing a game genre to see a few examples.",
                                 "Hey, I didn't understand that. I suggest sending a game genre",
                                 "Text me ABOUT to learn about the JBot project.",
                                 "The program responds to COMMANDS only. You have to send a command that I understand. :)",
                                 "Yo. I do not know what you are talking about. Send me a HELLO",
                                 "That is a ton of words you just wrote there... I really don't know. Try typing a game genre",
                                 "Right now, punctuation throws me off. Send text without it. Try",
                                 "Try sending a command without punctuation.",
                                 "I'm not programmed to ignore punctuation. So if you're sending something other than letters... I don't understand it."
                                ];

                var arrayIndex = Math.floor( Math.random() * messages.length );


                return messages[arrayIndex];
                
            }            
            

            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }

/* Here I call getReply, if I wan't a single answer, I would type 'some text' instead of getReply()   */

                if (!_.has(scriptRules, upperText)) {
                    return bot.say(getReply () ).then(() => 'speak');
                }

                var response = scriptRules[upperText];
                var lines = response.split('\n');

                var p = Promise.resolve();
                _.each(lines, function(line) {
                    line = line.trim();
                    p = p.then(function() {
                        console.log(line);
                        return bot.say(line);
                    });

                })

                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }

    
});
