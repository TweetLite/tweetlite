import Twit from 'twit';
import _ from 'underscore';
import method from './method';
import clor from 'clor';
import libnotify from 'libnotify';
import trayballoon from 'trayballoon';
import {forEachAsync} from 'forEachAsync';
import os from 'os';
import {help, SelectData, FollowCheck, FavoriteCheck, ForeverCheck, haller} from './util.js';

const methods = _.allKeys(method);

export default class TT {
	constructor(obj) {
		this.T = new Twit(obj);
		this._injectMethods();
	}

	_injectMethods() {
		methods.forEach(item => {
			this[item] = obj => {
				return new Promise((resolve, reject) => {
					this.T[method[item].method](method[item].path, obj || {}, (err, data) => {
						if (err && err.statusCode !== 403) {
							reject(err);
						} else {
							resolve(data);
						}
					});
				});
			};
		});
	}
	fullSearch(...obj) {
		const query = _.extend({lang: 'tr', result_type: 'recent', count: 100}, obj || {});
		const limit = 2;
		let count = 0;
		const dump = [];

		const loadTwit = ((obj, cb) => {
			return this.search(obj).then(data => {
				dump.push(data.statuses);
				if (count !== limit && count < limit) {
					query.max_id = data.search_metadata.max_id;
					loadTwit(query, cb);
					count++;
				} else {
					return cb(dump);
				}
			});
		});

		return new Promise(resolve => {
			return loadTwit(query, dump => {
				const data = _.filter(_.flatten(dump), item => {
					return !item.retweeted_status;
				});
				resolve(data.map(twet => {
					return {
						text: twet.text,
						id: twet.id,
						id_str: twet.id_str,
						user: twet.user.id,
						user_str: twet.user.id_str
					};
				}));
			});
		});
	}

	stream(...obj) {
		return this.T.stream('statuses/filter', obj);
	}

	streamAction(twet, notification, favorite, takip) {
		const dump = [];
		let msg = null;

		if (!twet.retweeted_status) {
			Promise.all([this.blocks({stringify_ids: true}), this.friends({stringify_ids: true})]).then(data => {
				if (!_.contains(data[0].ids, twet.user.id_str) && !_.contains(data[1].ids, twet.user.id_str)) {
					if (takip === 'Yes') {
						dump.push(this.userCreate({user_id: twet.user.id_str, follow: true}));
					}

					if (favorite === 'Yes') {
						dump.push(this.favorite({id: twet.id_str}));
					}

					if (takip === 'Yes' && favorite === 'Yes') {
						msg = `takip ettik ve twet'ini favorilere ekledik`;
					} else if (takip === 'Yes') {
						msg = ` takip ettik `;
					} else if (favorite === 'Yes') {
						msg = ` twet'ini favorilere ekledik`;
					}
				} else {
					dump.push(null);
				}

				dump.push(msg);

				return Promise.all(dump);
			}).then(data => {
				if (data[0] !== null && !_.has(data[0], 'errors')) {
					let message = null;
					if (typeof data[1] === 'string') {
						message = data[1];
					}

					if (typeof data[2] === 'string') {
						message = data[2];
					}

					console.log(`${clor.green(util.hal(twet.user.screen_name, 'i'))}	${clor.green(message)}`);

					if (notification && notification !== null) {
						if (os.platform() === 'linux') {
							libnotify.notify(message, {title: `${util.hal(twet.user.screen_name, 'i')}`, image: 'twitbot'});
						} else if (os.platform() === 'win32') {
							trayballoon({text: `${util.hal(twet.user.screen_name, 'i')} ${message}`, icon: '../assets/48.ico', timeout: 20000});
						}
					}
				}
			});
		}
	}

	fullUserDestroy(list) {
		return forEachAsync(list, (next, item) => {
			this.userDestroy({user_id: item}).then(data => {
				if (data && data !== 'undefined') {
					next();
				}
			});
		});
	}

	fullUserFollow(list) {
		return Promise.all(list.map(item => {
			return this.usercreate({
				user_id: item,
				follow: true
			});
		}));
	}

	notFollowingList(obj) {
		return Promise.all([this.followers(), this.friends()]).then(data => {
			return obj === true ? data[0].ids : _.difference(data[1].ids, data[0].ids);
		});
	}

	fullUserFavorite(list) {
		return Promise.all(list.map(item => {
			return this.favorite({id: item});
		}));
	}

	fullDestoryFavorite(list) {
		return Promise.all(list.map(item => {
			return this.favoriteDestroy({id: item.id_str});
		}));
	}

	fullUserMessage(list, msg) {
		return Promise.all(list.map(function (item) {
			return this.messageCreate({
				user_id: item,
				text: msg
			});
		}));
	}
	_Middleware(next){
		next(twet,this);
	}
}
