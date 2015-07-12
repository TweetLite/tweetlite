/**
 * Module dependencies.
 */
import 'babel-polyfill'
import Twit from 'twit'
import _ from 'lodash'
import promiseSeries from 'promise-series2'
import debug from 'debug'
import method from './method'
import * as util from './util'

const log = debug('twitbot:core')
/**
 *  TwitBotCore Class.
 *  new TwitBot({})
 */

export default class TwitBot {
	/*
   * Initialize a new `TwitBot`.
   *
   * @api public
   */
	constructor(obj) {
		if (!obj && typeof obj !== 'object') {
			throw new Error('Config not found!')
		}

		obj.timeout_ms = obj.timeout || 60 * 1000

		this.T = new Twit(obj)
		log(`Created TwitBot function`)
		this.extra = {}
		this.utils = {}
		this.extraModules()
		this.utils._inject = util.inject.bind(this)
		this.utils._inject(method)
	}
	/**
   * Example:
   *
   *    twitbot.use({hello:{
	 *			path: 'search/tweets',
	 *			method: 'get'
 	 *     }})
	 *		or
	 *		twitbot.use(() => {
	 *			return myfunc(){
	 *				console.log('hey')
	 *			}
 	 *		})
	 *
   * @param {Object} methods
	 * or
	 * @param {Function} fn
   * @api public
   */
	use(methods) {
		if (typeof methods === 'object') {
			this.utils._inject(methods)
			log(`injection extra methods.. ${_.keys(methods)}`)
		} else {
			const fn = methods
			const name = fn().name
			if (name === '') {
				throw new Error('must be function name')
			}
			this.extra[name] = fn.bind(this)()
		}
	}

		/**
	   * extramodules injection
		 * @return {TwitBot} self
	   * @api private
	   */
	extraModules() {
		/**
	   * fullFavoriteList promies call
		 * @param {Array} list ['xx', 'xxx', 'xx']
		 * @return {Promise} self
	   * @api public
	   */
		this.extra.fullFavoriteList = list => {
			return promiseSeries(id => this.favoriteCreate({id}), list)
		}
		/**
	   * fullDestoryFavorite promies call
		 * @param {Array} list ['xx', 'xxx', 'xx']
		 * @return {Promise} self
	   * @api public
	   */
		this.extra.fullDestoryFavorite = list => {
			return promiseSeries(id => this.favoriteDestroy({id}), list)
		}
		/**
	   * fullUserFollow promies call
		 * @param {Array} list ['xx', 'xxx', 'xx']
		 * @return {Promise} self
	   * @api public
	   */
		this.extra.fullUserFollow = list => {
			return promiseSeries(user_id => this.userCreate({user_id}), list) // eslint-disable-line camelcase
		}
		/**
	   * fullUserDestroy promies call
		 * @param {Array} list ['xx', 'xxx', 'xx']
		 * @return {Promise} self
	   * @api public
	   */
		this.extra.fullUserDestroy = lists => {
			return promiseSeries(user_id => this.userDestroy({user_id}), lists) // eslint-disable-line camelcase
		}
		/**
	   * fullUserMessage promies call
		 * @param {Array} list ['xx', 'xxx', 'xx']
		 * @param {String} msg `Hello world yay!`
		 * @return {Promise} self
	   * @api public
	   */
		this.extra.fullUserMessage = (list, msg) => {
			return promiseSeries(user_id => this.messageCreate({user_id, text: msg}), list)// eslint-disable-line camelcase
		}
		/**
	   * fullFollowers promies call
		 * @param {Object} opt {params}
		 * @return {Promise} self
	   * @api public
	   */
		this.extra.fullFollowers = async(opt = {count: 5000, stringify_ids: true}) => {
			try {
				const followers = util.nextCursor.bind(this)
				const ids = await followers(opt, 'followers')
				return _.flattenDeep(ids)
			} catch (err) {
				return err
			}
		}
		/**
	   * fullFollowings promies call
		 * @param {Object} opt {params}
		 * @return {Promise} self
	   * @api public
	   */
		this.extra.fullFollowings = async(opt = {count: 5000, stringify_ids: true}) => {
			try {
				const friends = util.nextCursor.bind(this)
				const ids = await friends(opt, 'friends')
				return _.flattenDeep(ids)
			} catch (err) {
				return err
			}
		}
		/**
	   * fullBlocks promies call
		 * @param {Object} opt {params}
		 * @return {Promise} self
	   * @api public
	   */
		this.extra.fullBlocks = async(opt = {count: 5000, stringify_ids: true}) => {
			try {
				const blocks = util.nextCursor.bind(this)
				const ids = await blocks(opt, 'blocks')
				return _.flattenDeep(ids)
			} catch (err) {
				return err
			}
		}
		/**
	   * fullFavorites promies call
		 * @param {Object} opt {params}
		 * @return {Promise} self
	   * @api public
	   */
		this.extra.fullFavorites = async opt => {
			try {
				const favorite = util.maxId.bind(this)
				const favorites = await favorite(Object.assign({count: 200, include_entities: false}, opt), 'favorites')
				return favorites
			} catch (err) {
				return err
			}
		}
		/**
	   * fullSearch promies call
		 * @param {Object} opt {params}
		 * @return {Promise} self
	   * @api public
	   */
		this.extra.fullSearch = opt => {
			const fullSearch = util.fullSearch.bind(this)
			return fullSearch(opt)
		}
		/**
	   * notFollowingList promies call
		 * @param {Object} opt {params}
		 * @return {Promise} self
	   * @api public
	   */
		this.extra.notFollowingList = async opt => {
			try {
				const followers = await this.followers()
				const friends = await this.friends()
				return opt === true ? followers.ids : _.difference(followers.ids, friends.ids)
			} catch (err) {
				return err
			}
		}

		log(`injection extra functions.. ${_.keys(this.extra)}`)

		return this
	}
}
