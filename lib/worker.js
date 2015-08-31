var argv = require('optimist').argv;
var TT = require('../lib/twit.js');
var util = require('../lib/util.js');
var clor = require('clor');
var nconf = require('nconf');
var _ = require('underscore');
var osHomedir = require('os-homedir');
var path = require('path');
nconf.file({ file: path.join(osHomedir(),'.twitbotrc') });

var confd = nconf.get('users:'+argv.name);

var T = new TT({consumer_key:confd.Consumer_Key,consumer_secret:confd.Consumer_Secret,access_token:confd.Access_Token,access_token_secret:confd.Access_Token_Secret});

var keywords = argv.keywords.split(',');


var stream = T.Stream({ track: keywords, language:confd.lang })
console.log(`   ${clor.bgCyan.bold.inverse.white('  TWİTBOT CANLI TAKİP ⚫ ')}`);
stream.on('tweet', function (tweet) {
    T.StreamAction(tweet,argv.notification,argv.favorite,argv.takip);
});

stream.on('disconnect', function (disconnectMessage) {
  console.log(`${clor.red('Bağlantı koptuğu için canlı takip sonlandı')}`);
  console.log(disconnectMessage);
  process.exit(1);
});