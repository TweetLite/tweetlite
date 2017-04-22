/**
 * Module dependencies.
 */
import 'babel-polyfill'
import Twit from 'twit-core'
import _ from 'lodash'
import promiseSeries from 'promise-series2'
import debug from 'debug'
import method from './method'
import * as util from './util'

const log = debug('tweetlite:core')
/**
 *  TweetLiteCore Class.
 *  new TweetLite({})
 */

export default class TweetLite {
	/*
   * Initialize a new `TweetLite`.
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
   *    tweetlite.use({hello:{
	 *			path: 'search/tweets',
	 *			method: 'get'
 	 *     }})
	 *		or
	 *		tweetlite.use(() => {
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
		 * @return {TweetLite} self
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
			return promiseSeries((id, val) => util.throttle(this.favoriteCreate({id}), val), list)
		}
		/**
	   * fullDestoryFavorite promies call
		 * @param {Array} list ['xx', 'xxx', 'xx']
		 * @return {Promise} self
	   * @api public
	   */
		this.extra.fullDestoryFavorite = list => {
			return promiseSeries((id, val) => util.throttle(this.favoriteDestroy({id}), val), list)
		}
		/**
	   * fullUserFollow promies call
		 * @param {Array} list ['xx', 'xxx', 'xx']
		 * @return {Promise} self
	   * @api public
	   */
		this.extra.fullUserFollow = list => {
			return promiseSeries((user_id, val) => util.throttle(this.userCreate({user_id}), val), list) // eslint-disable-line camelcase
		}
		/**
	   * fullUserDestroy promies call
		 * @param {Array} list ['xx', 'xxx', 'xx']
		 * @return {Promise} self
	   * @api public
	   */
		this.extra.fullUserDestroy = list => {
			return promiseSeries((user_id, val) => util.throttle(this.userDestroy({user_id}), val), list) // eslint-disable-line camelcase
		}
		/**
	   * fullUserMessage promies call
		 * @param {Array} list ['xx', 'xxx', 'xx']
		 * @param {String} msg `Hello world yay!`
		 * @return {Promise} self
	   * @api public
	   */
		this.extra.fullUserMessage = (list, msg) => {
			return promiseSeries((user_id, val) => util.throttle(this.messageCreate({user_id, text: msg}), val), list) // eslint-disable-line camelcase
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
				throw err
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
				throw err
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
				throw err
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
				throw err
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
		this.extra.notFollowingList = async () => {
			try {
				const followers = await this.extra.fullFollowers()
				const friends = await this.extra.fullFollowings()
				return followers.filter(f => friends.indexOf(f) === -1)
			} catch (err) {
				throw err
			}
		}

		log(`injection extra functions.. ${_.keys(this.extra)}`)

		return this
	}
}
