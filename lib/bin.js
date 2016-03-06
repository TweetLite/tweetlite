import nconf from 'nconf';
import parseArgs from 'minimist';
import inquirer from 'inquirer';
import _ from 'underscore';
import clor from 'clor';
import osHomedir from 'os-homedir';
import TT from './twit';
import {help, followCheck, favoriteCheck, foreverCheck, haller} from './util.js';
import forever from 'forever';
import path from 'path';
import {config, start, blacklist, live, accountlist, messagelist, _process} from './question';

nconf.file({file: path.join(osHomedir(), '.twitbotrc')});

const args = parseArgs(process.argv);
const cmd = args._;
const notification = args.notification ? args.notification : null;

switch (cmd[2]) {
	case 'new' :
	case 'N' :
		inquirer.prompt(config, answers => {
			nconf.set(`users:${answers.username}`, answers);
			nconf.save(err => {
				if (err) {
					console.error(err);
				} else {
					console.log(`  ${clor.green('Transactions completed.')}`);
				}
			});
		});
		break;
	case 'start':
	case 'S':
		if (_.allKeys(nconf.get('users')).length > 0) {
			const ques = start;
			ques[0].choices = _.allKeys(nconf.get('users'));
			inquirer.prompt(ques, answers => {
				const name = answers.select_account;
				const confd = nconf.get(`users:${name}`);
				const T = new TT({confd});

				T.fullSearch({q: answers.keyword, count: answers.takip_sayi, lang: confd.lang})
				.then(data => {
					data = data.slice(0, answers.takip_sayi);
					return Promise.all([data, T.blocks({stringify_ids: true})]);
				}).then(data => {

					const Twetlist = data[0];
					const Blacklist = data[1];

					// const SearchUsersList = _.pluck(Twetlist, 'user_str'); wtf is this ?

					const FollowList = _.filter(Twetlist, twet => {
						return _.indexOf(Blacklist.ids, twet.user_str) !== -1;
					});

					const list = [];
					if (answers.takip === 'Yes') {
						list.push(T.fullUserFollow(_.pluck(FollowList, 'user_str')));
					}
					if (answers.favorite === 'Yes') {
						list.push(T.fullUserFavorite(_.pluck(FollowList, 'id_str')));
					}

					return Promise.all(list);
				}).then(data => {

					console.log(`  ${clor.green('Transactions completed.')}`);
					if (answers.takip === 'Yes' && answers.favorite === 'No') {
						const FollowCount = followCheck(data[0]);
						console.log(`  ${clor.yellow(`${FollowCount} people were followed.`)}`);
					}

					if (answers.favorite === 'Yes' && answers.takip === 'No') {
						const FavoriteCount = favoriteCheck(data[0]);
						console.log(`  ${clor.yellow(`${FavoriteCount} tweets favorite added.`)}`);
					}

					if (answers.takip === 'Yes' && answers.favorite === 'Yes') {
						const FollowCount = followCheck(data[0]);
						const FavoriteCount = favoriteCheck(data[1]);
						console.log(`  ${clor.yellow(`${FollowCount} people were followed.`)}`);
						console.log(`  ${clor.yellow(`${FavoriteCount} tweets favorite added. `)}`);
					}

				}).catch(err => {
					console.error(err);
				});
			});
		} else {
			console.log(`${clor.red('First, you must define an account [ > twitbot new]')}`);
		}
		break;
	case 'blacklist' :
	case 'B' :
		if (_.allKeys(nconf.get('users')).length > 0) {
			const ques = blacklist;
			ques[0].choices = _.allKeys(nconf.get('users'));
			inquirer.prompt(ques, answers => {
				const name = answers.select_account;
				const SearchName = answers.blacklist_username;
				const confd = nconf.get(`users:${name}`);
				const T = new TT(confd);

				T.userLookup({screen_name: SearchName}).then(data => {
					let that = null;
					if (typeof data.id_str !== 'undefined' && data.code !== 50) {
						that = T.blockCreate({user_id: data[0].id_str});
					}
					return that;
				}).then(respons => {
					let that = null;
					if (respons === null) {
						console.log(`  ${clor.yellow('On behalf of these users did not find the account, make sure you spelled correctly.')}`);
					} else {
						console.log(`  ${clor.green(`${haller(respons.screen_name, 'i')} added to the banned list ..`)}`);
						that = T.blocks(); // wtf this
					}
					return that;
				}).catch(err => {
					console.error(err);
				});
			});
		} else {
			console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`);
		}
		break;
	case 'live' :
	case 'L' :
		if (_.allKeys(nconf.get('users')).length > 0) {
			inquirer.prompt(live, answers => {
				const name = answers.select_account;
				const confd = nconf.get(`users:${name}`);
				const T = new TT({confd});

				let keywords = null;
				if ( typeof answers.keywords === 'object' ) {
					keywords = answers.keywords;
				} else {
					keywords = answers.keywords.split(',');
				}

				const stream = T.stream({track: keywords, language: confd.lang});
				console.log(`   ${clor.bgCyan.bold.inverse.white('  TWİTBOT LİVE TRACKİNG ⚫ ')}`);

				stream.on('tweet', tweet => {
					T.streamAction(tweet, notification, answers.favorite, answers.takip);
				});

				stream.on('disconnect', disconnectMessage => {
					console.log(`${clor.red('It ended the connection was lost to follow live')}`);
					console.error(disconnectMessage);
					process.exit(1);
				});

			});
		} else {
			console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`);
		}
		break;
	case 'forever' :
	case 'F' :
		if (_.allKeys(nconf.get('users')).length > 0) {
			if (args.stop) {
				forever.list(false, (err, _process) => {

					if (err) {
						console.error(err);
						return;
					}

					const twitbot = foreverCheck(_process);

					if (twitbot.length > 0 ) {

						const plist = _process.map( item => {
							return {
								foreverPid: item.foreverPid,
								pid: item.pid,
								uid: item.uid,
								name: item.uid.split('_')[1]
							};
						});

						const ques = _process;
						ques[0].choices = _.pluck(plist, 'name');
						inquirer.prompt(ques, answers => {

							forever.stopbypid(_.pluck(_.filter(plist, item => {
								return item.name === answers.select_pid;
							}), 'pid')[0]);

							console.log(`${clor.green('Background stopped working bots. [ > twitbot F ]')}`);
						});

					} else {
						console.log(`${clor.red('Background not working bots. [ > twitbot F ]')}`);
					}
			   });
			} else {
				const ques = live;
				ques[0].choices = _.allKeys(nconf.get('users'));
				inquirer.prompt(ques, answers => {

					const name = answers.select_account;

					let keywords = null;
					if (typeof answers.keywords === 'object') {
						keywords = answers.keywords;
					} else {
						keywords = answers.keywords.split(',');
					}

					forever.startDaemon(path.join(__dirname, './worker.js'), {
						uid: `twitbot_${name}`,
						args:
						[`--keywords=${keywords.toString()}`,
						`--favorite=${answers.favorite}`,
						`--notification=${notification}`,
						`--name=${name}`,
						`--takip=${answers.takip}`]
					});

				});
			}
		} else {
			console.log(`${clor.red('First, you must define an account  [ > twitbot new ]')}`);
		}
		break;
	case 'unfavorite' :
	case 'UF' :
		if (_.allKeys(nconf.get('users')).length > 0) {
			const ques = accountlist;
			ques[0].choices = _.allKeys(nconf.get('users'));
			inquirer.prompt(ques, answers => {
				const name = answers.select_account;
				const confd = nconf.get(`users:${name}`);
				const T = new TT({confd});

				T.favorites({count: 200, include_entities: false})
				.then(data => {
					return T.fullDestoryFavorite(data);
				}).then(() => {
					console.log(`  ${clor.green('All favorites removed')}`);
				}).catch(err => {
					console.err(err);
				});
			});
		} else {
			console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`);
		}
		break;
	case 'flush' :
	case 'FL' :
		nconf.remove('users');
		nconf.save(err => {
			if (err) {
				console.error(err);
			} else {
				console.log(`  ${clor.green('Transactions completed...')}`);
			}
		});
		break;
	case 'message':
	case 'M':
		if (_.allKeys(nconf.get('users')).length > 0) {
			const ques = messagelist;
			ques[0].choices = _.allKeys(nconf.get('users'));
			inquirer.prompt(ques, answers => {
				const name = answers.select_account;
				const confd = nconf.get(`users:${name}`);
				const T = new TT({confd});

				if (answers.send === 'Yes' && answers.message) {
					T.followers().then(data => {
						data = data.ids.slice(0, answers.limit);
						return T.fullUserMessage(data, answers.message);
					}).then(respons => {
						const MessageCount = respons.length;
						console.log(`  ${clor.green(`Persons posted ${MessageCount} messages `)}`);
					}).catch(err => {
						console.error(err);
					});
				} else {
					console.log(`${clor.red('Come back when he decided to take a message..')}`);
				}

			});
		} else {
			console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`);
		}
		break;
	case 'unfollow' :
	case 'U' :
		if (_.allKeys(nconf.get('users')).length > 0) {
			const ques = accountlist;
			ques[0].choices = _.allKeys(nconf.get('users'));
			inquirer.prompt(ques, answers => {
				const name = answers.select_account;
				const confd = nconf.get(`users:${name}`);
				const T = new TT({confd});

				T.notFollowingList().then(data => {
					return T.fullUserDestroy(data);
				}).then(() => {
					console.log(`  ${clor.green('all users unfollowed..')}`);
				}).catch(err => {
					console.log(err);
				});
			});
		} else {
			console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`);
		}
		break;
	case 'worker':
	case 'W':
		if (typeof process.env.twitbotUsername === 'undefined' &&
			typeof process.env.twitbotConsumerKey === 'undefined' &&
			typeof process.env.twitbotConsumerSecret === 'undefined' &&
			typeof process.env.twitbotAccessToken === 'undefined' &&
			typeof process.env.twitbotAccessTokenSecret === 'undefined' &&
			typeof process.env.twitbotlang === 'undefined' &&
			typeof process.env.twitbotFollow === 'undefined' &&
			typeof process.env.twitbotFavorite === 'undefined' &&
			typeof process.env.twitbotKeywords === 'undefined') {
				console.log(`${clor.red('First, you must define an environment ')}`);
		} else {
			if (args.stop) {

				   forever.list(false, function (err, __process) {

					   if (err) {
						   console.error(err);
						   return;
					   }

					   const twitbot = foreverCheck(__process);

					   if (twitbot.length > 0) {

						const plist = __process.map(item => {
							return {
								   foreverPid: item.foreverPid,
								   pid: item.pid,
								   uid: item.uid,
								   name: item.uid.split('_')[1]
								   };
							});

						const ques = _process;
						ques[0].choices = _.pluck(plist, 'name');
						inquirer.prompt(ques, answers => {
							forever.stopbypid(_.pluck(_.filter(plist, item => {
								return item.name === answers.select_pid;
							}), 'pid')[0]);
							console.log(`${clor.green('Background stopped working bots. [ > twitbot F ]')}`);
						});
					} else {
						console.log(`${clor.red('Background not working bots. [ > twitbot F ]')}`);
					}
				});
			} else {
				forever.startDaemon(path.join(__dirname, '../worker.js'), {uid: `twitbot_${process.env.twitbotUsername}`});
			}
		}
		break;
	case 'version':
	case 'V':
		console.log(require('../package.json').version);
		break;
	case 'help':
	case 'H' :
		help();
		break;
	default:
		help();
}
