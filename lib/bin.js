import nconf from 'nconf';
import parseArgs from 'minimist';
import inquirer from 'inquirer';
import _ from 'lodash'; // lodash ile değiştirilmesi gerek
import clor from 'clor';
import osHomedir from 'os-homedir';
import TT from './twit';
import {help, followCheck, favoriteCheck, foreverCheck, haller, spinnerMsg} from './util.js';
import forever from 'forever';
import path from 'path';
import {config, start, blacklist, live, accountlist, messagelist, __process, unfollowlist} from './question';

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
		if (_.keys(nconf.get('users')).length > 0) {
			const ques = start;
			ques[0].choices = _.keys(nconf.get('users'));
			inquirer.prompt(ques, answers => {
				const name = answers.select_account;
				const confd = nconf.get(`users:${name}`);
				const T = new TT(confd);


			  T.searchFollow({q:answers.keyword,takip_sayi:answers.takip_sayi, lang:confd.lang}).then(followList => {
				return followList;
			}).then(list => {

				const infoList = [];
                if (answers.takip === 'Yes') {
                	infoList.push(T.FullUserFollow(list.map(item => item.user.id)));
                }
                if(answers.favorite === 'Yes') {
                	infoList.push(T.FullUserFavorite(list.map(item => item.id)));
                }

				return infoList;
			}).then(result => {
				 console.log(`  ${clor.green('Transactions completed.')}`);
                    if (answers.takip === 'Yes' && answers.favorite === 'No') {
                        console.log(`  ${clor.yellow(`${data[0].length}  people were followed.`)}`);
                    }

                    if (answers.favorite === 'Yes' && answers.takip === 'No') {
						console.log(`  ${clor.yellow(`${data[0].length}  tweets favorite added.`)}`);
                    }

                    if (answers.takip === 'Yes' && answers.favorite === 'Yes') {
                        console.log(`  ${clor.yellow(`${data[0].length} people were followed.`)}`);
                        console.log(`  ${clor.yellow(`${data[1].length} tweets favorite added.`)}`);
                    }

			}).catch(err => {
				console.log(err);
			});
			});
		} else {
			console.log(`${clor.red('First, you must define an account [ > twitbot new]')}`);
		}
		break;
	case 'blacklist' :
	case 'B' :
		if (_.keys(nconf.get('users')).length > 0) {
			const ques = blacklist;
			ques[0].choices = _.keys(nconf.get('users'));
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
		if (_.keys(nconf.get('users')).length > 0) {
			const ques = live;
			ques[0].choices = _.keys(nconf.get('users'));
			inquirer.prompt(ques, answers => {
				const name = answers.select_account;
				const confd = nconf.get(`users:${name}`);
				const T = new TT(confd);

				let keywords = null;
				if (typeof answers.keywords === 'object') {
					keywords = answers.keywords;
				} else {
					keywords = answers.keywords.split(',');
				}

				const stream = T.stream({track: keywords, language: confd.lang});

				spinnerMsg(`TWİTBOT LİVE TRACKİNG`, true);

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
		if (_.keys(nconf.get('users')).length > 0) {
			if (args.stop) {
				forever.list(false, (err, _process) => {
					if (err) {
						console.error(err);
						return;
					}

					const twitbot = foreverCheck(_process);

					if (twitbot.length > 0) {
						const plist = _process.map(item => {
							return {
								foreverPid: item.foreverPid,
								pid: item.pid,
								uid: item.uid,
								name: item.uid.split('_')[1]
							};
						});

						const ques = __process;
						ques[0].choices = _.pick(plist, 'name');
						inquirer.prompt(ques, answers => {
							forever.stopbypid(_.pick(_.filter(plist, item => {
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
				ques[0].choices = _.keys(nconf.get('users'));
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
		if (_.keys(nconf.get('users')).length > 0) {
			const ques = accountlist;
			ques[0].choices = _.keys(nconf.get('users'));
			inquirer.prompt(ques, answers => {
				const name = answers.select_account;
				const confd = nconf.get(`users:${name}`);
				const T = new TT(confd);

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
		if (_.keys(nconf.get('users')).length > 0) {
			const ques = accountlist;
			const users = nconf.get('users');
			ques[0].choices = _.keys(users);
			inquirer.prompt(ques, answers => {
				delete users[answers.select_account];
				nconf.set(`users`, users);
				nconf.save(err => {
					if (err) {
						console.error(err);
					} else {
						console.log(`  ${clor.green('Transactions completed.')}`);
					}
				});
			});
		} else {
			console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`);
		}
		break;
	case 'message':
	case 'M':
		if (_.keys(nconf.get('users')).length > 0) {
			const ques = messagelist;
			ques[0].choices = _.keys(nconf.get('users'));
			inquirer.prompt(ques, answers => {
				const name = answers.select_account;
				const confd = nconf.get(`users:${name}`);
				const T = new TT(confd);

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
		if (_.keys(nconf.get('users')).length > 0) {
			const ques = unfollowlist;
			ques[0].choices = _.keys(nconf.get('users'));
			inquirer.prompt(ques, answers => {
				const name = answers.select_account;
				const confd = nconf.get(`users:${name}`);
				const T = new TT(confd);
				let type = null;

				if (answers.type === "Yes") {
					type = true;
				} else {
					type = false;
				}

				T.notFollowingList(type).then(data => {
					return T.fullUserDestroy(data);
				}).then(() => {
					console.log(`  ${clor.green('All users unfollowed..')}`);
				}).catch(err => {
					console.log(err);
				});
			});
		} else {
			console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`);
		}
		break;
	case 'watch':
	case 'WC':
		if (_.keys(nconf.get('users')).length > 0) {
			const ques = live;
			ques[0].choices = _.keys(nconf.get('users'));
			inquirer.prompt(ques, answers => {
				const name = answers.select_account;
				const confd = nconf.get(`users:${name}`);
				const T = new TT(confd);

				let keywords = null;
				if (typeof answers.keywords === 'object') {
					keywords = answers.keywords;
				} else {
					keywords = answers.keywords.split(',');
				}

				const stream = T.stream({track: keywords, language: confd.lang});
				console.log(`   ${clor.bgCyan.bold.inverse.white('  TWİTBOT LİVE WATCHİNG ⚫ ')}`);

				stream.on('tweet', tweet => {
					T._Middleware(tweet, notification, answers.favorite, answers.takip);
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
	case 'worker':
	case 'W':
		if (typeof process.env.twitbotUsername === 'undefined' && typeof process.env.twitbotConsumerKey === 'undefined' && typeof process.env.twitbotConsumerSecret === 'undefined' && typeof process.env.twitbotAccessToken === 'undefined' && typeof process.env.twitbotAccessTokenSecret === 'undefined' && typeof process.env.twitbotlang === 'undefined' && typeof process.env.twitbotFollow === 'undefined' && typeof process.env.twitbotFavorite === 'undefined' && typeof process.env.twitbotKeywords === 'undefined') {
			console.log(`${clor.red('First, you must define an environment ')}`);
		} else if (args.stop) {
			forever.list(false, (err, _process) => {
				if (err) {
					console.error(err);
				} else {
					const twitbot = foreverCheck(_process);
					if (twitbot.length > 0) {
						const plist = _process.map(item => {
							return {
								foreverPid: item.foreverPid,
								pid: item.pid,
								uid: item.uid,
								name: item.uid.split('_')[1]
							};
						});

						const ques = __process;
						ques[0].choices = _.pick(plist, 'name');
						inquirer.prompt(ques, answers => {
							forever.stopbypid(_.pick(_.filter(plist, item => {
								return item.name === answers.select_pid;
							}), 'pid')[0]);
							console.log(`${clor.green('Background stopped working bots. [ > twitbot F ]')}`);
						});
					} else {
						console.log(`${clor.red('Background not working bots. [ > twitbot F ]')}`);
					}
				}
			});
		} else {
			forever.startDaemon(path.join(__dirname, '../worker.js'), {uid: `twitbot_${process.env.twitbotUsername}`});
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
