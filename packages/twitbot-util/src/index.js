import path from 'path'
import clor from 'clor'
import _ from 'lodash'
import Spinners from 'cli-spinners'
import logUpdate from 'log-update'
import nconf from 'nconf'
import osHomedir from 'os-homedir'
import inquirer from 'inquirer'
import * as question from './question'
const spinner = Spinners.moon

const twitbotSettings = nconf
const twitbotWorkerData = nconf

twitbotSettings.file({file: path.join(osHomedir(), '.twitbotrc')})
twitbotWorkerData.file({file: path.join(__dirname, '.twitbotworker')})

export function help() {
	console.log(`
	${clor.bgCyan.bold.inverse.white('	TWİTBOT	')}
	profile : ${clor.cyan('Account used for identification.')} ${clor.yellow('[ > twitbot profile	]')}
	help : ${clor.cyan('Used to display the Help command.')} ${clor.yellow('[ > twitbot help	]')}
	search : ${clor.cyan('Bots used to start operations.')} ${clor.yellow('[ > twitbot search	]')}
	message : ${clor.cyan('It sends a message to all followers.')} ${clor.yellow('[ > twitbot mesaj	]')}
	version : ${clor.cyan('It shows the version of TWİTBOT. ')} ${clor.yellow('[ > twitbot version ]')}
	unfollow : ${clor.cyan('Unfollow used to initiate operations. ')} ${clor.yellow('[ > twitbot unfollow	 ]')}
	unfavorite : ${clor.cyan('Unfollow used to initiate operations. ')} ${clor.yellow('[ > twitbot unfavorite	 ]')}
	flush : ${clor.cyan('Flushed user account info')} ${clor.yellow('[ > twitbot flush	 ]')}

	watch : cominggggg

	`)
}

export function prompt(name, choices) {
	const ques = question[name]

	if (['start', 'blacklist', 'live', 'accountlist', 'unfollowlist', 'messagelist'].indexOf(name) !== -1) {
		if (choices) {
			ques[0].choices = choices
		} else {
			ques[0].choices = _.keys(twitbotSettings.get('users'))
		}
	}

	return new Promise(resolve => {
		inquirer.prompt(ques, answers => {
			resolve(answers)
		})
	})
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

export function foreverList(list) {
	return _.filter(list, item => item.uid.indexOf('twitbot_') > -1)
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

export function control(twet, ...blacklist) {
	const results = _.flattenDeep(blacklist).map(func => func(twet))
	if (results.indexOf(false) === -1) {
		return true
	}
	return false
}

export function action(twet, args, context, ...middlewares) {
	_.flattenDeep(middlewares).forEach(middleware => {
		middleware.call(context, twet, args)
	})
}

export {twitbotSettings}

export {twitbotWorkerData}

export {question}
