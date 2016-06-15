'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.question = exports.twitbotWorkerData = exports.twitbotSettings = undefined;
exports.help = help;
exports.prompt = prompt;
exports.checkUser = checkUser;
exports.getUser = getUser;
exports.getUsers = getUsers;
exports.settingsSave = settingsSave;
exports.foreverList = foreverList;
exports.spinnerMsg = spinnerMsg;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _clor = require('clor');

var _clor2 = _interopRequireDefault(_clor);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _cliSpinners = require('cli-spinners');

var _cliSpinners2 = _interopRequireDefault(_cliSpinners);

var _logUpdate = require('log-update');

var _logUpdate2 = _interopRequireDefault(_logUpdate);

var _nconf = require('nconf');

var _nconf2 = _interopRequireDefault(_nconf);

var _osHomedir = require('os-homedir');

var _osHomedir2 = _interopRequireDefault(_osHomedir);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _question = require('./question');

var question = _interopRequireWildcard(_question);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spinner = _cliSpinners2.default.moon;

var twitbotSettings = _nconf2.default;
var twitbotWorkerData = _nconf2.default;

twitbotSettings.file({ file: _path2.default.join((0, _osHomedir2.default)(), '.twitbotrc') });
twitbotWorkerData.file({ file: _path2.default.join(__dirname, '.twitbotworker') });

function help() {
	console.log('\n\t' + _clor2.default.bgCyan.bold.inverse.white('	TWİTBOT	') + '\n\tprofile : ' + _clor2.default.cyan('Account used for identification.') + ' ' + _clor2.default.yellow('[ > twitbot profile	]') + '\n\thelp : ' + _clor2.default.cyan('Used to display the Help command.') + ' ' + _clor2.default.yellow('[ > twitbot help	]') + '\n\tsearch : ' + _clor2.default.cyan('Bots used to start operations.') + ' ' + _clor2.default.yellow('[ > twitbot search	]') + '\n\tmessage : ' + _clor2.default.cyan('It sends a message to all followers.') + ' ' + _clor2.default.yellow('[ > twitbot mesaj	]') + '\n\tversion : ' + _clor2.default.cyan('It shows the version of TWİTBOT. ') + ' ' + _clor2.default.yellow('[ > twitbot version ]') + '\n\tunfollow : ' + _clor2.default.cyan('Unfollow used to initiate operations. ') + ' ' + _clor2.default.yellow('[ > twitbot unfollow	 ]') + '\n\tunfavorite : ' + _clor2.default.cyan('Unfollow used to initiate operations. ') + ' ' + _clor2.default.yellow('[ > twitbot unfavorite	 ]') + '\n\tflush : ' + _clor2.default.cyan('Flushed user account info') + ' ' + _clor2.default.yellow('[ > twitbot flush	 ]') + '\n\n\twatch : cominggggg\n\n\t');
}

function prompt(name, choices) {
	var ques = question[name];

	if (['start', 'blacklist', 'live', 'accountlist', 'unfollowlist', 'messagelist'].indexOf(name) !== -1) {
		if (choices) {
			ques[0].choices = choices;
		} else {
			ques[0].choices = _lodash2.default.keys(twitbotSettings.get('users'));
		}
	}

	return new Promise(function (resolve) {
		_inquirer2.default.prompt(ques, function (answers) {
			resolve(answers);
		});
	});
}

function checkUser() {
	return _lodash2.default.keys(twitbotSettings.get('users')).length > 0;
}

function getUser(name) {
	return twitbotSettings.get('users:' + name);
}

function getUsers() {
	return _nconf2.default.get('users');
}

function settingsSave(key, val) {
	var conf = arguments.length <= 2 || arguments[2] === undefined ? twitbotSettings : arguments[2];

	return new Promise(function (resolve, reject) {
		conf.set(key, val);
		conf.save(function (err) {
			if (err) {
				reject(err);
			} else {
				resolve('Transactions completed.');
			}
		});
	});
}

function foreverList(list) {
	return _lodash2.default.filter(list, function (item) {
		return item.uid.indexOf('twitbot_') > -1;
	});
}

function spinnerMsg(msg, opt) {
	var frameCount = 0;
	return setInterval(function () {
		var frames = spinner.frames;
		if (opt) {
			(0, _logUpdate2.default)('\t' + _clor2.default.bgCyan.bold.inverse.white(' ' + frames[frameCount = ++frameCount % frames.length] + ' ' + msg + '\t'));
		} else {
			(0, _logUpdate2.default)(' ' + frames[frameCount = ++frameCount % frames.length] + ' ' + msg + ' ');
		}
	}, spinner.interval);
}

exports.twitbotSettings = twitbotSettings;
exports.twitbotWorkerData = twitbotWorkerData;
exports.question = question;