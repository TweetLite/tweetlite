import clor from 'clor'
import loudRejection from 'loud-rejection'
import TwitBot from 'twitbot-core'
import * as util from 'twitbot-util'
import debug from 'debug'
const log = debug('twitbot')
loudRejection()

export function start(cmd, extra, version) {
	switch (cmd) {
		case 'profile' :
			(async() => {
				try {
					const answers = await util.prompt('config')
					const result = await util.settingsSave(`users:${answers.username}`, answers)
					console.log(`  ${clor.green(result)}`)
				} catch (err) {
					log(err)
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
						const twetList = await T.searchFollow({q: answers.keyword, takip_sayi: answers.takip_sayi, lang: confd.lang})
						let favoriteList = null
						let userList = null
						if (answers.favorite === 'Yes') {
							favoriteList	= await T.fullTwetFavorite(twetList.filter(twet => answers.select_account !== twet.user.screen_name).map(twet => twet.id))
						}
						if (answers.takip === 'Yes') {
							userList = await T.fullUserFollow(twetList.filter(twet => answers.select_account !== twet.user.screen_name).map(twet => twet.user.id))
						}
						console.log(`  ${clor.green('Transactions completed.')}`)
						if (answers.takip === 'Yes') {
							console.log(`  ${clor.yellow(`${userList.length}  people were followed.`)}`)
						}
						if (answers.favorite === 'Yes') {
							console.log(`  ${clor.yellow(`${favoriteList.length}  tweets favorite added.`)}`)
						}
					} catch (err) {
						log(err)
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
						const favoriteList = await T.fullFavoriteList()
						await T.fullDestoryFavorite(favoriteList.map(item => item.id_str))
						clearInterval(msg)
						console.log(`  ${clor.green('All favorites removed')}`)
					} catch (err) {
						log(err)
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
					try {
						const {select_account} = await util.prompt('accountlist')
						delete users[select_account]
						const msg = await util.settingsSave(`users`, users)
						console.log(msg)
					} catch (err) {
						log(err)
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
						if (answers.send === 'Yes' && answers.message) {
							const followersList = await T.fullFollowerList()
							let list = followersList.ids
							if (answers.limit) {
								list = list.slice(0, answers.limit)
							}
							const msgCount = await T.fullUserMessage(list, answers.message).length
							console.log(`  ${clor.green(`Persons posted ${msgCount} messages `)}`)
						} else {
							console.log(`${clor.red('Come back when he decided to take a message..')}`)
						}
					} catch (err) {
						log(err)
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
							const fullListids = await T.fullFollowerList()
							const result = await T.fullUserDestroy(fullListids)
							console.log(`${clor.red(`${result.length} users unfollowed..`)}`)
						}
					} catch (err) {
						log(err)
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
			util.help()
			break
		default:
			util.help()
	}
}
