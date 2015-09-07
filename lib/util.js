'use strict';

var clor = require('clor');
var _ = require('underscore'); 
var haller = require('haller'); 

exports.help = function(){
console.log(`
        ${clor.bgCyan.bold.inverse.white('  TWİTBOT  ')}
      new [ N ] : ${clor.cyan('Hesap tanımlaması için kullanılır. ')} ${clor.yellow('[ > twitbot new  ]')}
     help [ H ] : ${clor.cyan('Yardım komutlarını göstermek için kullanılır. ')} ${clor.yellow('[ > twitbot help  ]')}
     live [ L ] : ${clor.cyan('Canlı olarak gönderilen twetleri takip eder. ')} ${clor.yellow('[ > twitbot live  ]')}
    start [ S ] : ${clor.cyan('Bot işlemleri başlatmak için kullanılır.')} ${clor.yellow('[ > twitbot start  ]')}
    mesaj [ M ] : ${clor.cyan('Tüm takipçilere mesaj gönderir.')} ${clor.yellow('[ > twitbot mesaj  ]')}
  forever [ F ] : ${clor.cyan('Arkaplanda botun çalışmasını sağlar. ')} ${clor.yellow('[ > twitbot forever ]')}
  version [ V ] : ${clor.cyan('Twitbot versiyonunu gösterir. ')} ${clor.yellow('[ > twitbot version ]')}
 unfollow [ U ] : ${clor.cyan('Unfollow işlemleri başlatmak için kullanılır. ')} ${clor.yellow('[ > twitbot unfollow   ]')}
blacklist [ B ] : ${clor.cyan('Yasaklı kullanıcı işlemleri başlatmak için kullanılır. ')} ${clor.yellow('[ > twitbot blacklist  ]')}

Arkaplanda Çalışan Botları Durdurmak İçin
${clor.yellow('[ > twitbot F --stop  ]')}

Arkaplanda Çalışan Bot Bildirimleri İçin
${clor.yellow('[ > twitbot F --notification  ]')}

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
