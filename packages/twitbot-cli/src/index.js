import clor from 'clor'
import loudRejection from 'loud-rejection'
import TwitBot from 'twitbot-core'
import * as util from 'twitbot-util'
import omit from 'object.omit'
import debug from 'debug'

const log = debug('twitbot:cli')
loudRejection()

export default function (cmd, extra, version) {
	switch (cmd) {
		case 'profile' :
			(async() => {
				try {
					const answers = await util.prompt('config')
					const result = await util.settingsSave(`users:${answers.username}`, answers)
					console.log(`  ${clor.green(result)}`)
				} catch (err) {
					log(err)
					process.exit(1) // eslint-disable-line xo/no-process-exit
				}
			})()
			break
		case 'search':
			(async() => {
				if (util.checkUser()) {
					try {
						const answers = await util.prompt('search')
						const confd = util.getUser(answers.select_account)
						const T = new TwitBot(confd)
						const msg = util.spinnerMsg(`Twitbot working.. `)

						const twetList = await T.extra.fullSearch({q: answers.keyword, takip_sayi: answers.takip_sayi, lang: answers.lang})
						let favoriteList = null
						let userList = null
						const blocks = await T.extra.fullBlocks()

						const checkBlock = util.notActionBlocks(blocks)
						const checkName = util.notActionHimself(answers.select_account)

						const check = twetList.filter(twet => checkName(twet) !== false).filter(twet => checkBlock(twet) !== false)

						userList = check.map(twet => twet.user.id_str)
						favoriteList = check.map(twet => twet.id_str)

						if (answers.takip === 'Yes') {
							userList = await T.extra.fullUserFollow(userList)
						}

						if (answers.favorite === 'Yes') {
							favoriteList	= await T.extra.fullFavoriteList(favoriteList)
						}

						clearInterval(msg)
						console.log(`  ${clor.green('Transactions completed.')}`)
						if (answers.takip === 'Yes') {
							console.log(`  ${clor.yellow(`${userList.length}  people were followed.`)}`) // check userList error
						}
						if (answers.favorite === 'Yes') {
							console.log(`  ${clor.yellow(`${favoriteList.length}  tweets favorite added.`)}`)  // check favoriteList error
						}
					} catch (err) {
						log(err)
						process.exit(1) // eslint-disable-line xo/no-process-exit
					}
				} else {
					console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`)
				}
			})()
			break
		case 'unfavorite' :
			(async() => {
				if (util.checkUser()) {
					try {
						const {select_account} = await util.prompt('accountlist')
						const confd = util.getUser(select_account)
						const T = new TwitBot(confd)
						const msg = util.spinnerMsg(`Twitbot working.. `)
						const favoriteList = await T.extra.fullFavorites()
						await T.extra.fullDestoryFavorite(favoriteList.map(item => item.id_str))
						clearInterval(msg)
						console.log(`  ${clor.green('All favorites removed')}`)
					} catch (err) {
						log(err)
						process.exit(1) // eslint-disable-line xo/no-process-exit
					}
				} else {
					console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`)
				}
			})()
			break
		case 'flush' :
			(async() => {
				if (util.checkUser()) {
					const users = util.getUsers()
					let answers = null
					try {
						if (extra.noPrompt) {
							answers = extra
						} else {
							answers = await util.prompt('accountlist')
						}
						delete users[answers.select_account]
						const msg = await util.settingsSave(`users`, users)
						console.log(`  ${clor.green(msg)}`)
					} catch (err) {
						log(err)
						process.exit(1) // eslint-disable-line xo/no-process-exit
					}
				} else {
					console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`)
				}
			})()
			break
		case 'message':
			(async() => {
				if (util.checkUser()) {
					try {
						const answers = await util.prompt('messagelist')
						const confd = util.getUser(answers.select_account)
						const T = new TwitBot(confd)
						const msg = util.spinnerMsg(`Twitbot working.. `)
						if (answers.send === 'Yes' && answers.message) {
							const followersList = await T.extra.fullFollowers()
							let list = followersList.ids
							if (answers.limit) {
								list = list.slice(0, answers.limit)
							}
							const msgCount = await T.extra.fullUserMessage(list, answers.message).length
							clearInterval(msg)
							console.log(`  ${clor.green(`Persons posted ${msgCount} messages `)}`)
						} else {
							console.log(`${clor.red('Come back when he decided to take a message..')}`)
						}
					} catch (err) {
						log(err)
						process.exit(1) // eslint-disable-line xo/no-process-exit
					}
				} else {
					console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`)
				}
			})()
			break
		case 'unfollow' :
			(async() => {
				if (util.checkUser()) {
					try {
						const answers = await util.prompt('unfollowlist')
						const confd = util.getUser(answers.select_account)
						const T = new TwitBot(confd)
						if (answers.type === 'Yes') {
							const msg = util.spinnerMsg(`Twitbot working.. `)
							const fullListids = await T.extra.fullFollowers()
							const result = await T.extra.fullUserDestroy(fullListids)
							clearInterval(msg)
							console.log(`${clor.red(`${result.length} users unfollowed..`)}`)
						}
					} catch (err) {
						log(err)
						process.exit(1) // eslint-disable-line xo/no-process-exit
					}
				} else {
					console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`)
				}
			})()
			break
		case 'watch' :
			(async() => {
				if (util.checkUser()) {
					try {
						let query = null
						let confd = null
						let takip = null
						let favorite = null
						let username = null
						let lang = null
						const actionList = []
						const actionBlacklist = []
						if (extra.noPrompt || extra.account || extra.query) {
							confd = util.getUser(extra.account)
							query = extra.query.split(',')
							username = extra.account
							if (extra.follow) {
								takip = extra.follow
							}
							if (extra.favorite) {
								favorite = extra.favorite
							}
							if (extra.lang) {
								lang = extra.lang
							} else {
								lang = 'none'
							}
						} else {
							const answers = await util.prompt('watch')
							confd = util.getUser(answers.select_account)
							query = answers.keywords.split(',')
							username = answers.select_account
							takip = answers.follow
							favorite = answers.favorite
							lang = answers.lang
						}

						if (extra.src) {
							const extraMiddleware = require(extra.src)
							if (extraMiddleware.use) {
								actionList.push(extraMiddleware.use())
							}

							if (extraMiddleware.blacklist) {
								actionBlacklist.push(extraMiddleware.blacklist(extra))
							}
						}

						if (takip !== null && takip === 'Yes') {
							actionList.push(util.actionUserFollow())
						}

						if (favorite !== null && favorite === 'Yes') {
							actionList.push(util.actionFavorite())
						}

						const T = new TwitBot(confd)

						const blocks = await T.extra.fullBlocks()

						if (lang !== 'none') {
							actionBlacklist.push(util.okActionLanguage(lang))
						}
						actionBlacklist.push(util.notActionHimself(username))
						actionBlacklist.push(util.notActionBlocks(blocks))
						const stream = T.tweetStream({track: query})
						const msg = util.spinnerMsg(`Twitbot working.. `)
						stream.on('tweet', twet => {
							util.control(twet, actionBlacklist).then(result => {
								if (result.indexOf(false) === -1) {
									util.action(twet, extra, T, actionList)
								}
							}).catch(err => {
								// Houston we have a problem
								log(err)
							})
						})

						stream.on('disconnect', disconnectMessage => {
							clearInterval(msg)
							console.log(disconnectMessage)
							stream.start()
						})
					} catch (err) {
						log(err)
						process.exit(1) // eslint-disable-line xo/no-process-exit
					}
				} else {
					console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`)
				}
			})()
			break
		case 'use' :
			(async() => {
				if (util.checkUser()) {
					try {
						if (extra.src && extra.account) {
							const {src, account} = extra
							const args = omit(extra, ['src', 'account'])
							const confd = util.getUser(account)
							const T = new TwitBot(confd)

							const extraMiddleware = require(src)

							if (extraMiddleware.use) {
								let middleware = extraMiddleware.use()
								middleware = middleware.call(T, args)
							}
						} else {
							console.log(`${clor.red(' --src=~/hello  --account=johndoe ')}`)
						}
					} catch (err) {
						log(err)
						process.exit(1) // eslint-disable-line xo/no-process-exit
					}
				} else {
					console.log(`${clor.red('First, you must define an account  [ > twitbot new]')}`)
				}
			})()
			break
		case 'version':
			console.log(version)
			break
		case 'help':
			console.log(util.help())
			break
		default:
			console.log(util.help())
	}
}