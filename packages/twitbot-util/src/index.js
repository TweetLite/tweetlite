import path from 'path'
import clor from 'clor'
import _ from 'lodash'
import Spinners from 'cli-spinners'
import logUpdate from 'log-update'
import nconf from 'nconf'
import inquirer from 'inquirer'
import isPromise from '@urban/is-promise'
import debug from 'debug'

import * as question from './question'

const log = debug('twitbot:middleware')
const actionlog = debug('twitbot:action')
const spinner = Spinners.moon
const twitbotSettings = nconf

twitbotSettings.file({file: path.join(__dirname, '..', '.twitbotrc')})

export function help() {
	return `
	${clor.yellow('	TWİTBOT ')}
	profile : ${clor.cyan('Account used for identification.')}
	help : ${clor.cyan('Used to display the Help command.')}
	search : ${clor.cyan('Bots used to start operations.')}
	message : ${clor.cyan('It sends a message to all followers.')}
	version : ${clor.cyan('It shows the version of TWİTBOT. ')}
	unfollow : ${clor.cyan('Unfollow used to initiate operations. ')}
	unfavorite : ${clor.cyan('Unfollow used to initiate operations. ')}
	flush : ${clor.cyan('Flushed user account info')}
	watch : ${clor.cyan('Watched twitbot stream ')}
	use : ${clor.cyan('Using custom twitbot middleware')}
	`
}

export function prompt(name, choices) {
	const ques = question[name] // eslint-disable-line import/namespace

	if (['search', 'watch', 'accountlist', 'unfollowlist', 'messagelist'].indexOf(name) !== -1) {
		ques[0].choices = _.keys(twitbotSettings.get('users'))
		if (choices) {
			choices.forEach(item => {
				ques[item.index][item.key] = item.values
			})
		}
	}

	return inquirer.prompt(ques)
}

export function checkUser() {
	return (_.keys(twitbotSettings.get('users')).length > 0)
}

export function getUser(name) {
	return twitbotSettings.get(`users:${name}`)
}

export function getUsers() {
	return twitbotSettings.get(`users`)
}

export function settingsSave(key, val, conf = twitbotSettings) {
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
			logUpdate(`	${clor.bgCyan.bold.inverse.white(` ${frames[frameCount = ++frameCount % frames.length]} ${msg}	`)}`)
		} else {
			logUpdate(` ${frames[frameCount = ++frameCount % frames.length]} ${msg} `)
		}
	}, spinner.interval)
}

export function notActionUrl() {
	return function (twet) {
		return twet.text.match(new RegExp('(http|ftp|https)://[\\w-]+(\\.[\\w-]+)+([\\w-.,@?^=%&:/~+#-]*[\\w@?^=%&;/~+#-])?')) === null
	}
}
export function notActionHimself(username) {
	return function (twet) {
		return (twet.user.screen_name.toLowerCase() !== username.toLowerCase())
	}
}

export function okActionLanguage(lang) {
	return function (twet) {
		return (twet.user.lang === lang) && (twet.lang === lang)
	}
}

export function notActionBlocks(blocks) {
	return function (twet) {
		if (blocks.indexOf(twet.user.id_str) === -1) {
			return true
		}
		return false
	}
}

export function control(twet, ...blacklist) {
	const flattenFuncs = _.flattenDeep(blacklist)
	const dumps = []
	let normalFuncs = flattenFuncs.filter(func => !isPromise(func(twet)))
	let promiseFuncs = flattenFuncs.filter(func => isPromise(func(twet)))
	promiseFuncs = promiseFuncs.map(func => func(twet))
	normalFuncs = normalFuncs.map(fun => {
		if (fun(twet)) {
			return Promise.resolve(true)
		}
		return Promise.reject(new Error(`Blocked that twet`))
	})
	return Promise.all(dumps.concat(normalFuncs, promiseFuncs)).then(result => {
		return result.indexOf(false) === -1
	})
}

export function actionFavorite() {
	return async function (twet) {
		try {
			const favoriteResult = await this.favoriteCreate({id: twet.id_str})
			actionlog(`actionFavorite Done`)
			if (_.has(favoriteResult, 'errors')) {
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
	return async function (twet) {
		try {
			const followResult = await this.userCreate({user_id: twet.user.id_str})
			actionlog(`actionUserFollow Done`)

			if (_.has(followResult, 'errors')) {
				throw new Error(followResult.errors[0].message)
			}

			return followResult.following
		} catch (err) {
			throw err
		}
	}
}

export function action(twet, args, context, ...middlewares) {
	_.flattenDeep(middlewares).forEach(middleware => {
		(async() => {
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

export {twitbotSettings}

export {question}
