'use strict';
var argv = require('optimist').argv;
var TT = require('../lib/twit.js');
var util = require('../lib/util.js');
var clor = require('clor');
var nconf = require('nconf');
var _ = require('underscore');
var osHomedir = require('os-homedir');
var path = require('path');
nconf.file({ file: path.join(osHomedir(),'.twitbotrc') });

var db = {};

if(!argv){

  db.Consumer_Key = process.env.twitbotConsumerKey;
  db.Consumer_Secret = process.env.twitbotConsumerSecret;
  db.Access_Token = process.env.twitbotAccessToken;
  db.Access_Token_Secret = process.env.twitbotAccessTokenSecret
  db.keywords = process.env.twitbotKeywords.keywords.split(',');
  db.lang = process.env.twitbotlang;
  db.notification = null;
  if(process.env.twitbotFavorite == true){
    db.favorite = "Yes";
  }else{
    db.favorite = "No";
  }

  if(process.env.twitbotFollow == true){
    db.takip = "Yes";
  }else{
    db.takip = "No";
  }

}else{
  var confd = nconf.get('users:'+argv.name);
  db.Consumer_Key = confd.Consumer_Key;
  db.Consumer_Secret = confd.Consumer_Secret;
  db.Access_Token = confd.Access_Token;
  db.Access_Token_Secret = confd.Access_Token_Secret;
  db.keywords = argv.keywords.split(',');
  db.lang = confd.lang;
  db.notification = argv.notification;
  db.favorite = argv.favorite;
  db.takip = argv.takip;
}




var T = new TT({consumer_key:db.Consumer_Key,consumer_secret:db.Consumer_Secret,access_token:db.Access_Token,access_token_secret:db.Access_Token_Secret});

var stream = T.Stream({ track: db.keywords, language:db.lang })



console.log(`   ${clor.bgCyan.bold.inverse.white('  TWİTBOT LİVE TRACKİNG ⚫ ')}`);
stream.on('tweet', function (tweet) {
    T.StreamAction(tweet,db.notification,db.favorite,db.takip);
});

stream.on('disconnect', function (disconnectMessage) {
  console.log(`${clor.red('It ended the connection was lost to follow live')}`);
  console.log(disconnectMessage);
  process.exit(1);
});
