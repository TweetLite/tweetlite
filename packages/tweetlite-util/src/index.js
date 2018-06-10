import * as path from 'path'
import clor from 'clor'
import keys from 'lodash.keys'
import flattendeep from 'lodash.flattendeep'
import has from 'lodash.has'
import Spinners from 'cli-spinners'
import logUpdate from 'log-update'
import nconf from 'nconf'
import inquirer from 'inquirer'
import isPromise from '@urban/is-promise'
import debug from 'debug'

import * as question from './question'

const log = debug('tweetlite:middleware')
const actionlog = debug('tweetlite:action')
const spinner = Spinners.moon
const tweetliteSettings = nconf

tweetliteSettings.file({ file: path.join(__dirname, '..', '.tweetliterc') })

export function help() {
  return `
	${clor.yellow('	TweetLite ')}
	profile : ${clor.cyan('Account used for identification.')}
	help : ${clor.cyan('Used to display the Help command.')}
	search : ${clor.cyan('Bots used to start operations.')}
	message : ${clor.cyan('It sends a message to all followers.')}
	version : ${clor.cyan('It shows the version of TweetLite. ')}
	unfollow : ${clor.cyan('Unfollow used to initiate operations. ')}
	unfavorite : ${clor.cyan('Unfollow used to initiate operations. ')}
	flush : ${clor.cyan('Flushed user account info')}
	watch : ${clor.cyan('Watched twitbot stream ')}
	use : ${clor.cyan('Using custom twitbot middleware')}
	`
}

export function prompt(name, choices) {
  const ques = question[name]

  if (
    ['search', 'watch', 'accountlist', 'unfollowlist', 'messagelist'].indexOf(
      name
    ) !== -1
  ) {
    ques[0].choices = keys(tweetliteSettings.get('users'))
    if (choices) {
      choices.forEach(item => {
        ques[item.index][item.key] = item.values
      })
    }
  }

  return inquirer.prompt(ques)
}

export function checkUser() {
  return keys(tweetliteSettings.get('users')).length > 0
}

export function getUser(name) {
  return tweetliteSettings.get(`users:${name}`)
}

export function getUsers() {
  return tweetliteSettings.get(`users`)
}

export function settingsSave(key, val, conf = tweetliteSettings) {
  return new Promise((resolve, reject) => {
    conf.set(key, val)
    conf.save(err => {
      if (err) {
        reject(err)
      } else {
        resolve('Transactions completed.')
      }
    })
  })
}

export function spinnerMsg(msg, opt) {
  let frameCount = 0
  return setInterval(() => {
    const frames = spinner.frames
    if (opt) {
      logUpdate(
        `	${clor.bgCyan.bold.inverse.white(
          ` ${frames[(frameCount = ++frameCount % frames.length)]} ${msg}	`
        )}`
      )
    } else {
      logUpdate(
        ` ${frames[(frameCount = ++frameCount % frames.length)]} ${msg} `
      )
    }
  }, spinner.interval)
}

export function notActionUrl() {
  return function notActionUrlFN(twet) {
    return (
      twet.text.match(
        new RegExp(
          '(http|ftp|https)://[\\w-]+(\\.[\\w-]+)+([\\w-.,@?^=%&:/~+#-]*[\\w@?^=%&;/~+#-])?'
        )
      ) === null
    )
  }
}
export function notActionHimself(username) {
  return function notActionHimselfFN(twet) {
    return twet.user.screen_name.toLowerCase() !== username.toLowerCase()
  }
}

export function okActionLanguage(lang) {
  return function okActionLanguageFN(twet) {
    return twet.user.lang === lang && twet.lang === lang
  }
}

export function notActionBlocks(blocks) {
  return function notActionBlocksFN(twet) {
    if (blocks.indexOf(twet.user.id_str) === -1) {
      return true
    }
    return false
  }
}

export function control(twet, ...blacklist) {
  const flattenFuncs = flattendeep(blacklist)
  const dumps = []
  let normalFuncs = flattenFuncs.filter(func => !isPromise(func(twet)))
  let promiseFuncs = flattenFuncs.filter(func => isPromise(func(twet)))
  promiseFuncs = promiseFuncs.map(func => func(twet))
  normalFuncs = normalFuncs.map(fun => {
    if (fun(twet)) {
      return Promise.resolve(true)
    }
    return Promise.reject(
      new Error(` ${fun.name} function blocked that => ${twet.text}`)
    )
  })
  return Promise.all(dumps.concat(normalFuncs, promiseFuncs)).then(result => {
    return result.indexOf(false) === -1
  })
}

export function actionFavorite() {
  return async function(twet) {
    try {
      const favoriteResult = await this.favoriteCreate({ id: twet.id_str })
      actionlog(`actionFavorite Done`)
      if (has(favoriteResult, 'errors')) {
        throw new Error(favoriteResult.errors[0].message)
      }
      if (favoriteResult) {
        return true
      }
    } catch (err) {
      throw err
    }
  }
}

export function actionUserFollow() {
  return async function(twet) {
    try {
      const followResult = await this.userCreate({ user_id: twet.user.id_str })
      actionlog(`actionUserFollow Done`)

      if (has(followResult, 'errors')) {
        throw new Error(followResult.errors[0].message)
      }

      return followResult.following
    } catch (err) {
      throw err
    }
  }
}

export function action(twet, args, context, ...middlewares) {
  flattenDeep(middlewares).forEach(middleware => {
    ;(async () => {
      try {
        const result = await middleware.call(context, twet, args)
        if (result) {
          actionlog(`Action Ok => ${JSON.stringify(result)}`)
        } else {
          // Houston we have a problem
          log(`Seems like a problem ${result}`)
        }
      } catch (err) {
        log(err)
      }
    })()
  })
}

export { tweetliteSettings }

export { question }
