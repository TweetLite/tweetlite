'use strict';
import {argv} from 'optimist';
import TT from '../lib/twit.js';
import clor from 'clor';
import nconf from 'nconf';
import osHomedir from 'os-homedir';
import objectAssign from 'object-assign';
import path from 'path';

nconf.file({file: path.join(osHomedir(), '.twitbotrc')});

let db = {};

if (argv) {
	const confd = nconf.get(`users:${argv.name}`);
	db = objectAssign(confd, {keywords: argv.keywords.split(','), notification: argv.notification, favorite: argv.favorite, takip: argv.takip});
} else {
	db = objectAssign(process.env, {keywords: process.env.twitbotKeywords.keywords.split(','), favorite: process.env.twitbotFavorite === true ? 'Yes' : 'No', takip: process.env.twitbotFollow === true ? 'Yes' : 'No', lang: process.env.twitbotlang, notification: null});
}

const T = new TT({consumer_key: db.Consumer_Key, consumer_secret: db.Consumer_Secret, access_token: db.Access_Token, access_token_secret: db.Access_Token_Secret});

const stream = T.stream({track: db.keywords, language: db.lang});

console.log(`	 ${clor.bgCyan.bold.inverse.white('	TWİTBOT LİVE TRACKİNG ⚫ ')}`);
stream.on('tweet', tweet => {
	T.streamAction(tweet, db.notification, db.favorite, db.takip);
});

stream.on('disconnect', disconnectMessage => {
	console.log(`${clor.red('It ended the connection was lost to follow live')}`);
	console.log(disconnectMessage);
	process.exit(1);
});
