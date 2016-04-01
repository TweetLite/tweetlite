import clor from 'clor';
import _ from 'lodash';
import haller from 'haller';
import Spinners from 'cli-spinners';
import logUpdate from 'log-update';
import objectAssign from 'object-assign';
import nconf from 'nconf';
import osHomedir from 'os-homedir';
import path from 'path';
import inquirer from 'inquirer';
import * as question from './question';
const spinner = Spinners.moon;

nconf.file({file: path.join(osHomedir(), '.twitbotrc')});

export function help() {
	const message = `
	${clor.bgCyan.bold.inverse.white('	TWİTBOT	')}
	new [ N ] : ${clor.cyan('Account used for identification.')} ${clor.yellow('[ > twitbot new	]')}
	help [ H ] : ${clor.cyan('Used to display the Help command.')} ${clor.yellow('[ > twitbot help	]')}
	live [ L ] : ${clor.cyan('Follow live tweets sent. ')} ${clor.yellow('[ > twitbot live	]')}
	start [ S ] : ${clor.cyan('Bots used to start operations.')} ${clor.yellow('[ > twitbot start	]')}
	message [ M ] : ${clor.cyan('It sends a message to all followers.')} ${clor.yellow('[ > twitbot mesaj	]')}
	forever [ F ] : ${clor.cyan('Background allows the operation of the bots.')} ${clor.yellow('[ > twitbot forever ]')}
	version [ V ] : ${clor.cyan('It shows the version of TWİTBOT. ')} ${clor.yellow('[ > twitbot version ]')}
	unfollow [ U ] : ${clor.cyan('Unfollow used to initiate operations. ')} ${clor.yellow('[ > twitbot unfollow	 ]')}
	flush [ FL ] : ${clor.cyan('Flushed user account info')} ${clor.yellow('[ > twitbot flush	 ]')}
remove//	blacklist [ B ] : ${clor.cyan('Banned used to start operations. ')} ${clor.yellow('[ > twitbot blacklist	]')}

	For running in the background Bot Notifications
	${clor.yellow('[ > twitbot F --notification	]')} or ${clor.yellow('[ > twitbot forever --notification	]')}

	Background To Stop Working Bots
	${clor.yellow('[ > twitbot F --stop	]')} or ${clor.yellow('[ > twitbot forever --stop	]')}

	`;
	console.log(message);
}

export function prompt(name,choices) {
	const ques = question[name];

	if (['start', 'blacklist', 'live', 'accountlist', 'unfollowlist', 'messagelist'].indexOf(name) !== -1) {
		if(choices){
			ques[0].choices = choices;
		} else {
			ques[0].choices = _.keys(nconf.get('users'));
		}
	}

	return new Promise(resolve => {
		inquirer.prompt(ques, answers => {
			resolve(answers);
		});
	});
}

export function checkUser() {
	return (_.keys(nconf.get('users')).length > 0);
}

export function getUser(name) {
	return nconf.get(`users:${name}`);
}

export function getUsers() {
	return nconf.get(`users`);
}
export function nconfSave(key, val) {
	return new Promise((resolve, reject) => {
		nconf.set(key, val);
		nconf.save(err => {
			if (err) {
				reject(err);
			} else {
				resolve('Transactions completed.');
			}
		});
	});
}

export function selectData(list, blacklist, key) {
	const filt = _.filter(list, item => {
		return !_.matches(blacklist, item.user.id);
	});

	if (key) {
		return _.pick(filt, key);
	}
	return filt;
}

export function followCheck(list) {
	return _.filter(list, item => item.following === true).length;
}

export function favoriteCheck(list) {
	return _.filter(list, item => {
		return _.has(item, 'errors');
	}).length;
}

export function foreverCheck(list) {
	return _.filter(list, item => {
		return item.uid.indexOf('twitbot_') > -1;
	});
}

export function spinnerMsg(msg, opt) {
	let frameCount = 0;

	return setInterval(() => {
		const frames = spinner.frames;
		if (opt) {
			logUpdate(`	${clor.bgCyan.bold.inverse.white(` ${frames[frameCount = ++frameCount % frames.length]} ${msg}	`)}`);
		} else {
			logUpdate(` ${frames[frameCount = ++frameCount % frames.length]} ${msg} `);
		}
	}, spinner.interval);
}

export function FullSearch(obj = {}) {
	const query = _.pick(objectAssign({lang: 'tr', result_type: 'recent', count: 100}, obj), ['q', 'lang', 'count', 'result_type', 'count']);
	let limit = null;
	if (obj.takip_sayi > 200) {
		limit = 7;
	} else if (obj.takip_sayi > 400 && obj.takip_sayi <= 700) {
		limit = 10;
	} else {
		limit = 3;
	}

	let count = 0;
	const dump = [];

	const loadTwit = ((obj, cb) => {
		return this.search(obj).then(data => {
			dump.push(data.statuses);
			if (data.search_metadata.next_results !== undefined || count !== limit && count < limit) {
				query.max_id = query.max_id = (/max_id=([^&]*)/g).exec(data.search_metadata.next_results)[1];
				loadTwit(query, cb);
				count++;
			} else {
				return cb(dump);
			}
		});
	});

	return new Promise(resolve => loadTwit(query, dump => resolve(_.flattenDeep(dump).map(item => _.pick(item, ['text', 'id', 'id_str', 'user', 'user_str'])))));
}

export function FullBlocks(obj = {}) {
	const query = obj;
	const dump = [];

	const loadList = ((obj, cb) => {
		return this.blocks(obj).then(data => {
			dump.push(data.ids);
			if (data.next_cursor === -1 || data.next_cursor === 0) {
				return cb(dump);
			}
			query.cursor = data.next_cursor;
			loadList(query, cb);
		});
	});

	return new Promise(resolve => loadList(query, blocks => resolve(_.flattenDeep(blocks))));
}

// Rate limit 15 minute
export function FullFavorites(obj = {count: 200, include_entities: false}) {
	const query = obj;
	let dump = [];

	const loadFavorite = ((obj, cb) => {
		return this.favorites(obj).then(data => {
			dump = dump.concat(data);
			if (data.length === 0) {
				return cb(dump);
			}
			query.max_id = data[data.length - 1].id;
			loadFavorite(query, cb);
		});
	});

	return new Promise(resolve => loadFavorite(query, favorites => resolve(favorites)));
}

export function FullFollowings(obj = {count: 5000}) {
	const query = obj;
	const dump = [];

	const loadFollowingList = ((obj, cb) => {
		return this.friends(obj).then(data => {
			dump.push(data.ids);
			if (data.next_cursor === -1 || data.next_cursor === 0) {
				return cb(dump);
			}
			query.cursor = data.next_cursor;
			loadFollowingList(query, cb);
		});
	});

	return new Promise(resolve => loadFollowingList(query, blocks => resolve(_.flattenDeep(blocks))));
}

export function FullFollowers(obj = {count: 5000}) {
	const query = obj;
	const dump = [];

	const loadFollowersList = ((obj, cb) => {
		return this.followers(obj).then(data => {
			dump.push(data.ids);
			if (data.next_cursor === -1 || data.next_cursor === 0) {
				return cb(dump);
			}
			query.cursor = data.next_cursor;
			loadFollowersList(query, cb);
		});
	});

	return new Promise(resolve => loadFollowersList(query, list => resolve(_.flattenDeep(list))));
}

export {haller};
