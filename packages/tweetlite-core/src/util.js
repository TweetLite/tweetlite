import _ from 'lodash'
import keys from 'lodash.keys'
import has from 'lodash.has'
import flattenDeep from 'lodash.flattendeep'
import pick from 'lodash.pick'
import debug from 'debug'

const log = debug('tweetlite:core:util')
const error_codes = [
  32,
  34,
  64,
  68,
  88,
  89,
  92,
  130,
  131,
  135,
  136,
  161,
  179,
  185,
  187,
  215,
  226,
  231,
  251,
  261,
  271,
  272,
  354
]

/**
 *  TweetLiteCore inject method utility.
 *  @param {Object} methods
 *  @api public
 */
export function inject(methods) {
  const fmethods = keys(methods)
  fmethods.forEach(name => {
    this[name] = params => {
      if (methods[name].method === 'stream') {
        log(`Stream ${name} working, params ${JSON.stringify(params || {})}`)
        return this.T.stream(methods[name].path, params || {})
      }
      return new Promise((resolve, reject) => {
        log(`TweetLite ${name} working, params ${JSON.stringify(params || {})}`)
        this.T[methods[name].method](
          methods[name].path,
          params || {},
          (err, data) => {
            setTimeout(() => {
              if (err && err.statusCode !== 403) {
                reject(err)
              } else if (has(data, 'errors')) {
                if (error_codes.indexOf(data.errors[0].code) === -1) {
                  resolve(data)
                } else {
                  reject(new Error(data.errors[0].message))
                }
              } else {
                resolve(data)
              }
            }, 15000)
          }
        )
      })
    }
  })
}
/**
 *  TweetLiteCore nextCursor funcion.
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

  const loadAll = (obj, next) => {
    return this[method](obj)
      .then(data => {
        dump.push(data.ids)
        log(`Working nextCursor ${JSON.stringify(obj)}`)
        if (data.next_cursor === -1 || data.next_cursor === 0) {
          return next(null, dump)
        }
        query.cursor = data.next_cursor
        loadAll(query, next)
      })
      .catch(err => {
        next(err, null)
      })
  }

  return new Promise((resolve, reject) => {
    loadAll(query, (err, datas) => {
      if (err === null) {
        resolve(datas)
      } else {
        reject(err)
      }
    })
  })
}
/**
 *  TweetLiteCore maxId funcion.
 *  @param {Object} opt
 *  @param {String} method
 *  @return {Promise}
 *  @api public
 */
export function maxId(opt, method) {
  const query = opt
  let dump = []

  const loadAll = (obj, next) => {
    return this[method](obj)
      .then(data => {
        dump = dump.concat(data)
        log(`Working maxId ${JSON.stringify(obj)}`)
        if (data.length === 0) {
          return next(null, dump)
        }
        query.max_id = data[data.length - 1].id
        loadAll(query, next)
      })
      .catch(err => {
        next(err, null)
      })
  }

  return new Promise((resolve, reject) => {
    loadAll(query, (err, datas) => {
      if (err === null) {
        resolve(datas)
      } else {
        reject(err)
      }
    })
  })
}

/**
 *  TweetLiteCore fullSearch funcion.
 *  @param {Object} opt
 *  @return {Promise}
 *  @api public
 */
export function fullSearch(obj) {
  const query = pick(
    Object.assign({ result_type: 'recent', count: 100 }, obj),
    ['q', 'lang', 'count', 'result_type', 'count']
  )
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

  const loadTwit = (obj, next) => {
    return this.search(obj)
      .then(data => {
        log(`Working FullSearch ${JSON.stringify(obj)}}`)
        dump.push(data.statuses)
        if (
          count !== limit &&
          count <= limit &&
          data.search_metadata.next_results !== undefined
        ) {
          query.max_id = query.max_id = /max_id=([^&]*)/g.exec(
            data.search_metadata.next_results
          )[1]
          loadTwit(query, next)
          count++
        } else {
          return next(null, dump)
        }
      })
      .catch(err => {
        next(err, null)
      })
  }
  return new Promise((resolve, reject) => {
    loadTwit(query, (err, dump) => {
      if (err === null) {
        resolve(flattenDeep(dump))
      } else {
        reject(err)
      }
    })
  })
}

export function throttle(method, val) {
  return new Promise((resolve, reject) => {
    if (val !== 0 && val % 15 === 0) {
      setTimeout(() => {
        method
          .then(res => {
            resolve(res)
          })
          .catch(err => reject(err))
      }, 900000)
    } else {
      method
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    }
  })
}
