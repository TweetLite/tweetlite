var argv = require('optimist').argv;
var TT = require('../lib/twit.js');
var util = require('../lib/util.js');
var chalk = require('chalk');
var Config = require('./config.js');
var osHomedir = require('os-homedir');
var conf = Config(osHomedir(),'.twitbotrc');

var confd = conf.get(argv.name);

var T = new TT({consumer_key:confd.consumer_key,consumer_secret:confd.consumer_secret,access_token:confd.access_token,access_token_secret:confd.access_token_secret});

var keywords = argv.keywords.split(',');



var stream = T.Stream({ track: keywords, language:confd.lang })
console.log('   '+chalk.bgCyan.bold.inverse.white('  TWİTBOT CANLI TAKİP ⚫ '));
stream.on('tweet', function (tweet) {
    T.StreamAction(tweet,name,argv.notification,argv.favorite);
});

stream.on('disconnect', function (disconnectMessage) {
  console.log(chalk.red('Bağlantı koptuğu için canlı takip sonlandı'));
  process.exit(1);
});