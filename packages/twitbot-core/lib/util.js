'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.inject = inject;
exports.nextCursor = nextCursor;
exports.maxId = maxId;
exports.FullSearch = FullSearch;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function inject(methods) {
	var _this = this;

	methods.forEach(function (item) {
		_this[item] = function (params) {
			if (item.method === 'stream') {
				return _this.T.stream(item.path, params || {});
			}
			return new Promise(function (resolve, reject) {
				_this.T[method[item].method](method[item].path, params || {}, function (err, data) {
					// eslint-disable-line
					if (err && err.statusCode !== 403) {
						reject(err);
					} else {
						resolve(data);
					}
				});
			});
		};
	});
}

function nextCursor() {
	var _this2 = this;

	var opt = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var method = arguments[1];

	var query = opt;
	var dump = [];

	if (!method) {
		throw new Error('Method not found');
	}

	var loadAll = function loadAll(obj, cb) {
		return _this2[method](obj).then(function (data) {
			dump.push(data.ids);
			if (data.next_cursor === -1 || data.next_cursor === 0) {
				return cb(dump);
			}
			query.cursor = data.next_cursor;
			loadAll(query, cb);
		});
	};

	return new Promise(function (resolve) {
		return loadAll(query, function (datas) {
			return resolve(datas);
		});
	});
}

function maxId() {
	var _this3 = this;

	var opt = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var method = arguments[1];

	var query = opt;
	var dump = [];

	var loadAll = function loadAll(obj, cb) {
		return _this3[method](obj).then(function (data) {
			dump = dump.concat(data);
			if (data.length === 0) {
				return cb(dump);
			}
			query.max_id = data[data.length - 1].id;
			loadAll(query, cb);
		});
	};

	return new Promise(function (resolve) {
		return loadAll(query, function (datas) {
			return resolve(datas);
		});
	});
}

function FullSearch() {
	var _this4 = this;

	var obj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	var query = _lodash2.default.pick((0, _objectAssign2.default)({ lang: 'tr', result_type: 'recent', count: 100 }, obj), ['q', 'lang', 'count', 'result_type', 'count']);
	var limit = null;
	if (obj.takip_sayi > 200) {
		limit = 7;
	} else if (obj.takip_sayi > 400 && obj.takip_sayi <= 700) {
		limit = 10;
	} else {
		limit = 3;
	}

	var count = 0;
	var dump = [];

	var loadTwit = function loadTwit(obj, cb) {
		return _this4.search(obj).then(function (data) {
			dump.push(data.statuses);
			if (data.search_metadata.next_results !== undefined || count !== limit && count < limit) {
				query.max_id = query.max_id = /max_id=([^&]*)/g.exec(data.search_metadata.next_results)[1];
				loadTwit(query, cb);
				count++;
			} else {
				return cb(dump);
			}
		});
	};

	return new Promise(function (resolve) {
		return loadTwit(query, function (dump) {
			return resolve(_lodash2.default.flattenDeep(dump).map(function (item) {
				return _lodash2.default.pick(item, ['text', 'id', 'id_str', 'user', 'user_str']);
			}));
		});
	});
}