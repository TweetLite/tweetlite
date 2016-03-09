import Twit from 'twit';
import _ from 'underscore';
import method from './method';
import clor from 'clor';
import libnotify from 'libnotify';
import trayballoon from 'trayballoon';
import {forEachAsync} from 'forEachAsync';
import objectAssign from 'object-assign';
import os from 'os';
import queryString from 'querystring';
import {help, SelectData, FollowCheck, FavoriteCheck, ForeverCheck, haller} from './util.js';
require("babel-polyfill");

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
	async fullSearch(obj) {
		const query = objectAssign({lang: 'tr', result_type: 'recent', count: 100}, obj);
		var max_id = null;
		const limit = 10;
		let dump = [];

		for (let i = 0; i < limit; i++) {
			const newid = max_id != null ? max_id : {};
			let result = await this.search(objectAssign(query,{max_id:newid}));

			if(result.search_metadata.next_results != undefined){
				max_id = result.search_metadata.next_results.split('&')[0].split('=')[1];
			}else{
				break;
			}
			dump.push(result.statuses);
		}

		return dump;
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
	async fullUserList() {

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
