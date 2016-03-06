import clor from 'clor';
import _ from 'underscore';
import Haller from 'haller';

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
	blacklist [ B ] : ${clor.cyan('Banned used to start operations. ')} ${clor.yellow('[ > twitbot blacklist	]')}


	For running in the background Bot Notifications
	${clor.yellow('[ > twitbot F --notification	]')} or ${clor.yellow('[ > twitbot forever --notification	]')}

	Background To Stop Working Bots
	${clor.yellow('[ > twitbot F --stop	]')} or ${clor.yellow('[ > twitbot forever --stop	]')}

	`;
	console.log(message);
}

export function SelectData(list, blacklist, key) {
	const filt = _.filter(list, item => {
		return !_.contains(blacklist, item.user.id);
	});

	if (key) {
		return _.pluck(filt, key);
	}
	return filt;
}

export function FollowCheck(list) {
	return _.filter(list, item => item.following === true).length;
}

export function FavoriteCheck(list) {
	return _.filter(list, item => {
		return _.has(item, 'errors');
	}).length;
}

export function ForeverCheck(list) {
	return _.filter(list, item => {
		return item.uid.indexOf('twitbot_') > -1;
	});
}

export {Haller};
