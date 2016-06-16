'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	followers: {
		path: 'followers/ids',
		method: 'get'
	},
	search: {
		path: 'search/tweets',
		method: 'get'
	},
	friends: {
		path: 'friends/ids',
		method: 'get'
	},
	favoriteCreate: {
		path: 'favorites/create',
		method: 'post'
	},
	userDestroy: {
		path: 'friendships/destroy',
		method: 'post'
	},
	userCreate: {
		path: 'friendships/create',
		method: 'post'
	},
	blocks: {
		path: 'blocks/ids',
		method: 'get'
	},
	favorites: {
		path: 'favorites/list',
		method: 'get'
	},
	favoriteDestroy: {
		path: 'favorites/destroy',
		method: 'post'
	},
	messageCreate: {
		path: 'direct_messages/new',
		method: 'post'
	},
	tweetStream: {
		path: 'statuses/filter',
		method: 'stream'
	}
};
module.exports = exports['default'];