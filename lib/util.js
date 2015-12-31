'use strict';

var clor = require('clor');
var _ = require('underscore');
var haller = require('haller');

exports.help = function(){
console.log(`
        ${clor.bgCyan.bold.inverse.white('  TWİTBOT  ')}
      new [ N ] : ${clor.cyan('Account used for identification.')} ${clor.yellow('[ > twitbot new  ]')}
     help [ H ] : ${clor.cyan('Used to display the Help command.')} ${clor.yellow('[ > twitbot help  ]')}
     live [ L ] : ${clor.cyan('Follow live tweets sent. ')} ${clor.yellow('[ > twitbot live  ]')}
    start [ S ] : ${clor.cyan('Bots used to start operations.')} ${clor.yellow('[ > twitbot start  ]')}
  message [ M ] : ${clor.cyan('It sends a message to all followers.')} ${clor.yellow('[ > twitbot mesaj  ]')}
  forever [ F ] : ${clor.cyan('Background allows the operation of the bots.')} ${clor.yellow('[ > twitbot forever ]')}
  version [ V ] : ${clor.cyan('It shows the version of TWİTBOT. ')} ${clor.yellow('[ > twitbot version ]')}
 unfollow [ U ] : ${clor.cyan('Unfollow used to initiate operations. ')} ${clor.yellow('[ > twitbot unfollow   ]')}
blacklist [ B ] : ${clor.cyan('Banned used to start operations. ')} ${clor.yellow('[ > twitbot blacklist  ]')}


For running in the background Bot Notifications
${clor.yellow('[ > twitbot F --notification  ]')} or ${clor.yellow('[ > twitbot forever --notification  ]')}

Background To Stop Working Bots
${clor.yellow('[ > twitbot F --stop  ]')} or ${clor.yellow('[ > twitbot forever --stop  ]')}

`);
};




exports.SelectData = function(list,blacklist,key){
  var filt = _.filter(list,function(item){
     return !_.contains(blacklist, item.user.id);
  });
  if(key) return _.pluck(filt,key);
  else return filt;
};

exports.FollowCheck = function (list){
   return  _.filter(list, function(item){ return item.following === true; }).length;
}


exports.FavoriteCheck= function (list){
    return  _.filter(list, function(item){ return !_.has(item, 'errors'); }).length;
}

exports.ForeverCheck= function (list){
    return  _.filter(list, function(item){ return item.uid.indexOf('twitbot_') > -1; });
}

exports.Hal = haller;
