import test from 'ava'
import TwitBot from '../src/index'
import Methods from '../src/method'

const fakeConfig = {consumer_key: 'xxx', consumer_secret: 'xxx', access_token: 'xxx', access_token_secret: 'xxx'}
const xconfig = {config: fakeConfig}

test.beforeEach(t => {
	t.context.twitbot = new TwitBot(fakeConfig)
})

test('Twitbot Core Test', async t => {
	xconfig._twitter_time_minus_local_time_ms = 0
	const twitbot = t.context.twitbot
	t.is(typeof TwitBot, 'function')
	t.not(typeof TwitBot, 'object')
	t.throws(() => new TwitBot())
	t.throws(() => new TwitBot({consumer_key: 'xxx', consumer_secret: 'xxx'}))
	t.notThrows(() => t.context.twitbot)
	t.deepEqual(twitbot.T, xconfig)
	t.is(typeof twitbot.T, 'object')
	t.is(typeof twitbot.extra, 'object')
	t.is(typeof twitbot.utils, 'object')

	t.throws(() => twitbot.extra.fullFollowers())
	t.throws(() => twitbot.extra.notFollowingList())
	t.throws(() => twitbot.extra.fullFavorites())
	t.throws(() => twitbot.extra.fullBlocks())
})

test('Twitbot Core middleware', async t => {
	const twitbot = t.context.twitbot
	const fakeMethods = {
		xFriends: {
			path: 'friends/ids',
			method: 'get'
		},
		xSearch: {
			path: 'search/tweets',
			method: 'get'
		}
	}
	twitbot.use(fakeMethods)
	t.throws(() => {
		twitbot.use(() => {
			return function () {
				console.log('bum')
			}
		})
	})

	t.notThrows(() => {
		twitbot.use(() => {
			return function heyhoy() {
				console.log('bum')
			}
		})
	})
	t.is(typeof twitbot.xFriends, 'function')
	t.is(typeof twitbot.xSearch, 'function')
	t.is(typeof twitbot.extra.heyhoy, 'function')
})

test('Methods test', t => {
	t.is(Object.keys(Methods).length, 11)
	t.deepEqual(Methods.search, {path: 'search/tweets', method: 'get'})
	t.is(typeof t.context.twitbot.search, 'function')
})
