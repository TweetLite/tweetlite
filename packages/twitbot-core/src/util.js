/**
 * Module dependencies.
 */
import _ from 'lodash'
import debug from 'debug'

const log = debug('twitbot:core:util')

/**
 *  TwitBotCore inject method utility.
 *  @param {Object} methods
 *  @api public
 */
export function inject(methods) {
	const fmethods = _.keys(methods)
	fmethods.forEach(name => {
		this[name] = params => {
			if (methods[name].method === 'stream') {
				log(`Stream ${name} working, params ${JSON.stringify(params)}`)
				return this.T.stream(methods[name].path, params || {})
			}
			return new Promise((resolve, reject) => {
				log(`Twitbot ${name} working, params ${JSON.stringify(params)}`)
				this.T[methods[name].method](methods[name].path, params || {}, (err, data) => {
					if (err && err.statusCode !== 403) {
						reject(err)
					} else {
						if(_.has(data, 'errors')){
							reject(new Error(data.errors[0].message))
						} else {
							resolve(data)
						}
					}
				})
			})
		}
	})
}
/**
 *  TwitBotCore nextCursor funcion.
 *  @param {Object} opt
 *  @param {String} method
 *  @return {Promise}
 *  @api public
 */
export function nextCursor(opt, method) {
	const query = opt
	const dump = []

	if (!method) {
		throw new Error('Method not found')
	}

	const loadAll = ((obj, next) => {
		return this[method](obj).then(data => {
			dump.push(data.ids)
			log(`Working nextCursor ${JSON.stringify(obj)}`)
			if (data.next_cursor === -1 || data.next_cursor === 0) {
				return next(null,dump)
			}
			query.cursor = data.next_cursor
			loadAll(query, next)
		}).catch(err => {
			next(err, null)
		})
	})

	return new Promise((resolve,reject) => {
		loadAll(query, (err, datas) => {
			
			if(err !== null){
				reject(err)
			} else {
				resolve(datas)
			}

		})
	})
}
/**
 *  TwitBotCore maxId funcion.
 *  @param {Object} opt
 *  @param {String} method
 *  @return {Promise}
 *  @api public
 */
export function maxId(opt, method) {
	const query = opt
	let dump = []

	const loadAll = ((obj, next) => {
		return this[method](obj).then(data => {
			dump = dump.concat(data)
			log(`Working maxId ${JSON.stringify(obj)}`)
			if (data.length === 0) {
				return next(null, dump)
			}
			query.max_id = data[data.length - 1].id
			loadAll(query, next)
		}).catch(err => {
			next(err, null)
		})
	})

	return new Promise((resolve,reject) => {
		loadAll(query, (err, datas) => {
			
			if(err !== null){
				reject(err)
			} else {
				resolve(datas)
			}

		})
	})
}

/**
 *  TwitBotCore fullSearch funcion.
 *  @param {Object} opt
 *  @return {Promise}
 *  @api public
 */
export function fullSearch(obj) {
	const query = _.pick(Object.assign({result_type: 'recent', count: 100}, obj), ['q', 'lang', 'count', 'result_type', 'count'])
	let limit = 1
	if (obj.takip_sayi >= 200) {
		limit = 3
	} else if (obj.takip_sayi > 400 && obj.takip_sayi <= 700) {
		limit = 6
	} else if (obj.takip_sayi < 200) {
		limit = 1
	}

	let count = 1
	const dump = []

	const loadTwit = ((obj, next) => {
		return this.search(obj).then(data => {
			log(`Working FullSearch ${JSON.stringify(obj)}}`)
			dump.push(data.statuses)
			if ((count !== limit && count <= limit) && data.search_metadata.next_results !== undefined) {
				query.max_id = query.max_id = (/max_id=([^&]*)/g).exec(data.search_metadata.next_results)[1]
				loadTwit(query, next)
				count++
			} else {
				return next(null,dump)
			}
		}).catch(err => {
			next(err, null)
		})
	})
	return new Promise((resolve,reject) => {
		loadTwit(query, (err, dump) =>{
			if(err !== null){
				reject(err)
			} else {
				resolve(_.flattenDeep(dump))
			}
		})
	})
}
