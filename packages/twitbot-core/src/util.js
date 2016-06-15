
import _ from 'lodash'
import objectAssign from 'object-assign'

export function inject(methods) {
	methods.forEach(item => {
		this[item] = obj => {
			return new Promise((resolve, reject) => {
				this.T[method[item].method](method[item].path, obj || {}, (err, data) => { // eslint-disable-line
					if (err && err.statusCode !== 403) {
						reject(err)
					} else {
						resolve(data)
					}
				})
			})
		}
	})
}

export function nextCursor(opt = {}, method) {
	const query = opt
	const dump = []

	if (!method) {
		throw new Error('Method not found')
	}

	const loadAll = ((obj, cb) => {
		return this[method](obj).then(data => {
			dump.push(data.ids)
			if (data.next_cursor === -1 || data.next_cursor === 0) {
				return cb(dump)
			}
			query.cursor = data.next_cursor
			loadAll(query, cb)
		})
	})

	return new Promise(resolve => loadAll(query, datas => resolve(datas)))
}

export function maxId(opt = {}, method) {
	const query = opt
	let dump = []

	const loadAll = ((obj, cb) => {
		return this[method](obj).then(data => {
			dump = dump.concat(data)
			if (data.length === 0) {
				return cb(dump)
			}
			query.max_id = data[data.length - 1].id
			loadAll(query, cb)
		})
	})

	return new Promise(resolve => loadAll(query, datas => resolve(datas)))
}

export function FullSearch(obj = {}) {
	const query = _.pick(objectAssign({lang: 'tr', result_type: 'recent', count: 100}, obj), ['q', 'lang', 'count', 'result_type', 'count'])
	let limit = null
	if (obj.takip_sayi > 200) {
		limit = 7
	} else if (obj.takip_sayi > 400 && obj.takip_sayi <= 700) {
		limit = 10
	} else {
		limit = 3
	}

	let count = 0
	const dump = []

	const loadTwit = ((obj, cb) => {
		return this.search(obj).then(data => {
			dump.push(data.statuses)
			if (data.search_metadata.next_results !== undefined || count !== limit && count < limit) {
				query.max_id = query.max_id = (/max_id=([^&]*)/g).exec(data.search_metadata.next_results)[1]
				loadTwit(query, cb)
				count++
			} else {
				return cb(dump)
			}
		})
	})

	return new Promise(resolve => loadTwit(query, dump => resolve(_.flattenDeep(dump).map(item => _.pick(item, ['text', 'id', 'id_str', 'user', 'user_str'])))))
}
