import test from 'ava'
import TweetLite from '../src/index'
import Methods from '../src/method'

const fakeConfig = {consumer_key: 'xxx', consumer_secret: 'xxx', access_token: 'xxx', access_token_secret: 'xxx'}
const xconfig = {config: fakeConfig}

test.beforeEach(t => {
	t.context.TweetLite = new TweetLite(fakeConfig)
})

test('TweetLite Core Test', async t => {
	xconfig._twitter_time_minus_local_time_ms = 0
	const TweetLite = t.context.TweetLite
	t.is(typeof TweetLite, 'function')
	t.not(typeof TweetLite, 'object')
	t.throws(() => new TweetLite())
	t.throws(() => new TweetLite({consumer_key: 'xxx', consumer_secret: 'xxx'}))
	t.notThrows(() => t.context.TweetLite)
	t.deepEqual(TweetLite.T, xconfig)
	t.is(typeof TweetLite.T, 'object')
	t.is(typeof TweetLite.extra, 'object')
	t.is(typeof TweetLite.utils, 'object')

	t.throws(() => TweetLite.extra.fullFollowers())
	t.throws(() => TweetLite.extra.notFollowingList())
	t.throws(() => TweetLite.extra.fullFavorites())
	t.throws(() => TweetLite.extra.fullBlocks())
})

test('TweetLite Core middleware', async t => {
	const TweetLite = t.context.TweetLite
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
	TweetLite.use(fakeMethods)
	t.throws(() => {
		TweetLite.use(() => {
			return function () {
				console.log('bum')
			}
		})
	})

	t.notThrows(() => {
		TweetLite.use(() => {
			return function heyhoy() {
				console.log('bum')
			}
		})
	})
	t.is(typeof TweetLite.xFriends, 'function')
	t.is(typeof TweetLite.xSearch, 'function')
	t.is(typeof TweetLite.extra.heyhoy, 'function')
})

test('Methods test', t => {
	t.is(Object.keys(Methods).length, 11)
	t.deepEqual(Methods.search, {path: 'search/tweets', method: 'get'})
	t.is(typeof t.context.TweetLite.search, 'function')
})
