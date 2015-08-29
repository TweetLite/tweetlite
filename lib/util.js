var chalk = require('chalk');
var _ = require('underscore'); 
var haller = require('haller'); 

exports.help = function(){
	 console.log([
        '      '+chalk.bgCyan.bold.inverse.white('  TWİTBOT  ')+
        '',
        '      new [ N ] : ' + chalk.cyan('Hesap tanımalası için kullanılır. ') + chalk.magenta('[ > twitbot new  ]'),
        '     help [ H ] : ' + chalk.cyan('Yardım komutlarını göstermek için kullanılır. ') + chalk.magenta('[ > twitbot help  ]'),
        '     live [ L ] : ' + chalk.cyan('Canlı olarak gönderilen twetleri takip eder.  ') + chalk.magenta('[ > twitbot live  ]'),
        '    start [ S ] : ' + chalk.cyan('Bot işlemleri başlatmak için kullanılır. ') + chalk.magenta('[ > twitbot start  ]'),
        '    mesaj [ M ] : ' + chalk.cyan('Tüm takipçilere mesaj gönderir. ') + chalk.magenta('[ > twitbot mesaj  ]'),
        '  forever [ F ] : ' + chalk.cyan('Arkplanda botun çalışmasını sağlar. ') + chalk.magenta('[ > twitbot forever  ]'),
        '  version [ V ] : ' + chalk.cyan('Twitbot versiyonunu gösterir. ') + chalk.magenta('[ > twitbot version  ]'),
        ' unfollow [ U ] : ' + chalk.cyan('Unfollow işlemleri başlatmak için kullanılır. ') + chalk.magenta('[ > twitbot unfollow  ]'),
        'blacklist [ B ] : ' + chalk.cyan('Yasaklı kullanıcı işlemleri başlatmak için kullanılır. ') + chalk.magenta('[ > twitbot blacklist  ]'),
        ].join('\n'));
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
    return  _.filter(list, function(item){ return item.uid === 'twitbot' });
}
 
exports.Hal = haller;
