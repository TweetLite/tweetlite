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
		this[name] = _.throttle(params => {
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
						resolve(data)
					}
				})
			})
		}, 60000)
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

	const loadAll = ((obj, cb) => {
		return this[method](obj).then(data => {
			dump.push(data.ids)
			log(`Working nextCursor ${JSON.stringify(obj)}`)
			if (data.next_cursor === -1 || data.next_cursor === 0) {
				return cb(dump)
			}
			query.cursor = data.next_cursor
			loadAll(query, cb)
		})
	})

	return new Promise(resolve => loadAll(query, datas => resolve(datas)))
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

	const loadAll = ((obj, cb) => {
		return this[method](obj).then(data => {
			dump = dump.concat(data)
			log(`Working maxId ${JSON.stringify(obj)}`)
			if (data.length === 0) {
				return cb(dump)
			}
			query.max_id = data[data.length - 1].id
			loadAll(query, cb)
		})
	})

	return new Promise(resolve => loadAll(query, datas => resolve(datas)))
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
		limit = 4
	} else if (obj.takip_sayi > 400 && obj.takip_sayi <= 700) {
		limit = 10
	} else if (obj.takip_sayi < 200) {
		limit = 2
	}

	let count = 1
	const dump = []

	const loadTwit = ((obj, cb) => {
		return this.search(obj).then(data => {
			log(`Working FullSearch ${JSON.stringify(obj)}}`)
			dump.push(data.statuses)
			if ((count !== limit && count <= limit) && data.search_metadata.next_results !== undefined) {
				query.max_id = query.max_id = (/max_id=([^&]*)/g).exec(data.search_metadata.next_results)[1]
				loadTwit(query, cb)
				count++
			} else {
				return cb(dump)
			}
		}).catch(err => {
			console.log(err)
		})
	})
	return new Promise(resolve => loadTwit(query, dump => resolve(_.flattenDeep(dump))))
}
