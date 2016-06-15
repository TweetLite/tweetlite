'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // eslint-disable-line


var _twit = require('twit');

var _twit2 = _interopRequireDefault(_twit);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _promiseSeries = require('promise-series2');

var _promiseSeries2 = _interopRequireDefault(_promiseSeries);

var _babelPolyfill = require('babel-polyfill');

var _babelPolyfill2 = _interopRequireDefault(_babelPolyfill);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _method = require('./method');

var _method2 = _interopRequireDefault(_method);

var _util = require('./util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fmethods = _lodash2.default.keys(_method2.default);

var TwitBot = function () {
	function TwitBot(obj) {
		_classCallCheck(this, TwitBot);

		this.T = new _twit2.default(obj);
		this.extra = {};
		this.utils = {};
		this.extraModules();
		this.utils.inject = util.inject.bind(this);
		this.utils.inject(fmethods);
	}

	_createClass(TwitBot, [{
		key: 'use',
		value: function use(methods) {
			this.utils.inject(_lodash2.default.keys(methods));
		}
	}, {
		key: 'extraModules',
		value: function extraModules() {
			var _this = this;

			this.extra.fullFavoriteList = function (list) {
				return (0, _promiseSeries2.default)(function (id) {
					return _this.favorite({ id: id });
				}, list);
			};

			this.extra.fullDestoryFavorite = function (list) {
				return (0, _promiseSeries2.default)(function (id) {
					return _this.favoriteDestroy({ id: id });
				}, list);
			};

			this.extra.fullUserFollow = function (list) {
				return (0, _promiseSeries2.default)(function (user_id) {
					return _this.userCreate({ user_id: user_id });
				}, list); // eslint-disable-line
			};

			this.extra.fullUserDestroy = function (list) {
				return (0, _promiseSeries2.default)(function (user_id) {
					return _this.userDestroy({ user_id: user_id });
				}, list); // eslint-disable-line
			};

			this.extra.fullUserMessage = function (list, msg) {
				return (0, _promiseSeries2.default)(function (user_id) {
					return _this.messageCreate({ user_id: user_id, text: msg });
				}, list); // eslint-disable-line
			};

			this.extra.fullFollowers = function _callee() {
				var opt = arguments.length <= 0 || arguments[0] === undefined ? { count: 5000 } : arguments[0];
				var followers, ids;
				return regeneratorRuntime.async(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								followers = util.next_cursor.bind(_this);
								_context.next = 3;
								return regeneratorRuntime.awrap(followers(opt, 'followers'));

							case 3:
								ids = _context.sent;
								return _context.abrupt('return', _lodash2.default.flattenDeep(ids));

							case 5:
							case 'end':
								return _context.stop();
						}
					}
				}, null, _this);
			};

			this.extra.fullFollowings = function _callee2() {
				var opt = arguments.length <= 0 || arguments[0] === undefined ? { count: 5000 } : arguments[0];
				var friends, ids;
				return regeneratorRuntime.async(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								friends = util.next_cursor.bind(_this);
								_context2.next = 3;
								return regeneratorRuntime.awrap(friends(opt, 'friends'));

							case 3:
								ids = _context2.sent;
								return _context2.abrupt('return', _lodash2.default.flattenDeep(ids));

							case 5:
							case 'end':
								return _context2.stop();
						}
					}
				}, null, _this);
			};

			this.extra.fullBlocks = function _callee3(opt) {
				var blocks, ids;
				return regeneratorRuntime.async(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								blocks = util.next_cursor.bind(_this);
								_context3.next = 3;
								return regeneratorRuntime.awrap(blocks(opt, 'blocks'));

							case 3:
								ids = _context3.sent;
								return _context3.abrupt('return', _lodash2.default.flattenDeep(ids));

							case 5:
							case 'end':
								return _context3.stop();
						}
					}
				}, null, _this);
			};

			this.extra.fullFavorites = function _callee4(opt) {
				var favorite, favorites;
				return regeneratorRuntime.async(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								favorite = util.max_id.bind(_this);
								_context4.next = 3;
								return regeneratorRuntime.awrap(favorite((0, _objectAssign2.default)({ count: 200, include_entities: false }, opt), 'favorites'));

							case 3:
								favorites = _context4.sent;
								return _context4.abrupt('return', favorites);

							case 5:
							case 'end':
								return _context4.stop();
						}
					}
				}, null, _this);
			};

			this.extra.fullSearch = function _callee5(opt) {
				var fullSearch;
				return regeneratorRuntime.async(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								fullSearch = util.FullSearch.bind(_this);
								return _context5.abrupt('return', fullSearch(opt));

							case 2:
							case 'end':
								return _context5.stop();
						}
					}
				}, null, _this);
			};

			this.extra.notFollowingList = function _callee6(opt) {
				var followers, friends;
				return regeneratorRuntime.async(function _callee6$(_context6) {
					while (1) {
						switch (_context6.prev = _context6.next) {
							case 0:
								_context6.prev = 0;
								_context6.next = 3;
								return regeneratorRuntime.awrap(_this.followers());

							case 3:
								followers = _context6.sent;
								_context6.next = 6;
								return regeneratorRuntime.awrap(_this.friends());

							case 6:
								friends = _context6.sent;
								return _context6.abrupt('return', opt === true ? followers.ids : _lodash2.default.difference(followers.ids, friends.ids));

							case 10:
								_context6.prev = 10;
								_context6.t0 = _context6['catch'](0);

								console.log(_context6.t0);

							case 13:
							case 'end':
								return _context6.stop();
						}
					}
				}, null, _this, [[0, 10]]);
			};
		}
	}]);

	return TwitBot;
}();

exports.default = TwitBot;
module.exports = exports['default'];