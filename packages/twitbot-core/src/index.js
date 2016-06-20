import Twit from 'twit'
import _ from 'lodash'
import promiseSeries from 'promise-series2'
import babelPolyfill from 'babel-polyfill' // eslint-disable-line no-unused-vars
import objectAssign from 'object-assign'
import method from './method'
import * as util from './util'

const fmethods = _.keys(method)

export default class TwitBot {
	constructor(obj) {
		this.T = new Twit(obj)
		this.extra = {}
		this.utils = {}
		this.extraModules()
		this.utils.inject = util.inject.bind(this)
		this.utils.inject(fmethods)
	}

	use(methods) {
		this.utils.inject(_.keys(methods))
	}
	extraModules() {
		this.extra.fullFavoriteList = list => {
			return promiseSeries(id => this.favorite({id}), list)
		}

		this.extra.fullDestoryFavorite = list => {
			return promiseSeries(id => this.favoriteDestroy({id}), list)
		}

		this.extra.fullUserFollow = list => {
			return promiseSeries(user_id => this.userCreate({user_id}), list) // eslint-disable-line camelcase
		}

		this.extra.fullUserDestroy = list => {
			return promiseSeries(user_id => this.userDestroy({user_id}), list) // eslint-disable-line camelcase
		}

		this.extra.fullUserMessage = (list, msg) => {
			return promiseSeries(user_id => this.messageCreate({user_id, text: msg}), list)// eslint-disable-line camelcase
		}

		this.extra.fullFollowers = async(opt = {count: 5000}) => {
			const followers = util.nextCursor.bind(this)
			const ids = await followers(opt, 'followers')
			return _.flattenDeep(ids)
		}

		this.extra.fullFollowings = async(opt = {count: 5000}) => {
			const friends = util.nextCursor.bind(this)
			const ids = await friends(opt, 'friends')
			return _.flattenDeep(ids)
		}

		this.extra.fullBlocks = async opt => {
			const blocks = util.nextCursor.bind(this)
			const ids = await blocks(opt, 'blocks')
			return _.flattenDeep(ids)
		}

		this.extra.fullFavorites = async opt => {
			const favorite = util.maxId.bind(this)
			const favorites = await favorite(objectAssign({count: 200, include_entities: false}, opt), 'favorites')
			return favorites
		}

		this.extra.fullSearch = async opt => {
			const fullSearch = util.FullSearch.bind(this)
			return fullSearch(opt)
		}

		this.extra.notFollowingList = async opt => {
			try {
				const followers = await this.followers()
				const friends = await this.friends()
				return opt === true ? followers.ids : _.difference(followers.ids, friends.ids)
			} catch (err) {
				return err
			}
		}
	}
}
