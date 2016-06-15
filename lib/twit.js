import Twit from 'twit'
import _ from 'lodash'
import promiseSeries from 'promise-series2'
import * as util from './util'
require('babel-polyfill');


export default class TT {
	constructor(obj) {
		this.T = new Twit(obj)
		const methods = util._inject.bind(this);
		methods();
	}
	fullSearch(obj) {
		return util.FullSearch.call(this, obj)
	}
	fullBlockList(obj) {
		return util.FullBlocks.call(this, obj)
	}
	fullFollowingList(obj) {
		return util.FullFollowings.call(this, obj)
	}
	fullFollowerList(obj) {
		return util.FullFollowers.call(this, obj)
	}
	fullFavoriteList(obj) {
		return util.FullFavorites.call(this, obj)
	}

	stream(obj) { // after remove that method
		return this.T.stream('statuses/filter', obj)
	}

	fullUserDestroy(list) {
		return promiseSeries(user_id => this.userDestroy({user_id}), list)
	}

	fullUserFollow(list) {
		return promiseSeries(user_id => this.userCreate({user_id}), list)
	}

	notFollowingList(obj) {
		return Promise.all([this.followers(), this.friends()]).then(data => {
			return obj === true ? data[0].ids : _.difference(data[1].ids, data[0].ids)
		})
	}
	fullTwetFavorite(list) {
		return promiseSeries(id => this.favorite({id}), list)
	}

	fullDestoryFavorite(list) {
		return promiseSeries(id => this.favoriteDestroy({id}), list)
	}

	fullUserMessage(list, msg) {
		return promiseSeries(list.map(user_id => {
			return this.messageCreate({
				user_id,
				text: msg
			})
		}))
	}

	async searchFollow(obj) {
		const msg = util.spinnerMsg(`Twitbot searching for "${obj.q.split(',')}" `)
		const twetts = await this.fullSearch(obj)
		const blocklist = await this.fullBlockList()
		const followinglist = await this.fullFollowingList()
		clearInterval(msg)
		return _.filter(twetts, item => {
			return blocklist.indexOf(item.user.id) === -1 || followinglist.indexOf(item.user.id) === -1
		}).slice(0, obj.takip_sayi)
	}

}
