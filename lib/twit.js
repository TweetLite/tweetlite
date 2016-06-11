import Twit from 'twit';
import _ from 'lodash';
import method from './method';
import clor from 'clor';
import libnotify from 'libnotify';
import trayballoon from 'trayballoon';
import os from 'os';
import * as util from './util';
import promiseSeries from 'promise-series2';

require("babel-polyfill");

const methods = _.keys(method);

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
	fullSearch(obj) {
		return util.FullSearch.call(this, obj);
	}
	fullBlockList(obj) {
		return util.FullBlocks.call(this, obj);
	}
	fullFollowingList(obj) {
		return util.FullFollowings.call(this, obj);
	}
	fullFollowerList(obj) {
		return util.FullFollowers.call(this, obj);
	}
	fullFavoriteList(obj) {
		return util.FullFavorites.call(this, obj);
	}

	async userBlock(username) {
		let blockUser = null;
		const userInfo = await this.userLookup({screen_name: username});
		if (!userInfo.id_str && userInfo.code !== 5) {
			blockUser = this.blockCreate({user_id: userInfo[0].id_str});
		}
		return blockUser;
	}

	async searchFollow(obj) {
		const msg = util.spinnerMsg(`Twitbot searching for "${obj.q.split(',')}" `);
		const twetts = await this.fullSearch(obj);
		const blocklist = await this.fullBlockList();
		const followinglist = await this.fullFollowingList();
		clearInterval(msg);
		return _.filter(twetts, item => {
			return blocklist.indexOf(item.user.id) === -1 || followinglist.indexOf(item.user.id) === -1;
		}).slice(0, obj.takip_sayi);
	}

	stream(obj) {
		return this.T.stream('statuses/filter', obj);
	}
	streamAction(twet, notification, favorite, takip) {
		const dump = [];
		let msg = null;

		if (!twet.retweeted_status) {
			Promise.all([this.blocks({stringify_ids: true}), this.friends({stringify_ids: true})]).then(data => {
				if (!_.matches(data[0].ids, twet.user.id_str) && !_.matches(data[1].ids, twet.user.id_str)) {
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
		return promiseSeries(user_id => this.userDestroy({user_id: user_id}), list);
	}

	fullUserFollow(list) {
		return promiseSeries(user_id => this.userCreate({user_id: user_id}), list);
	}

	notFollowingList(obj) {
		return Promise.all([this.followers(), this.friends()]).then(data => {
			return obj === true ? data[0].ids : _.difference(data[1].ids, data[0].ids);
		});
	}
	fullUserFavorite(list) {
		return promiseSeries(id => this.favorite({id: id}), list);
	}

	fullDestoryFavorite(list) {
		return promiseSeries(id => this.favoriteDestroy({id: id}), list);
	}

	fullUserMessage(list, msg) {
		return promiseSeries(list.map((item) => {
			return this.messageCreate({
				user_id: item,
				text: msg
			});
		}));
	}

	middleware(modules,context,twet){
		modules.forEach((module)=>{
			module(twet).bind(context)
		});
	}
}
