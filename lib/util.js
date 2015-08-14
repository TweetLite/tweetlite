var chalk = require('chalk');
var _ = require('underscore');

exports.help = function(){
	 console.log([
        '      '+chalk.bgCyan.bold.inverse.white('  TWİTBOT  ')+
        '',
        '      new [ N ] : ' + chalk.cyan('Hesap tanımalası için kullanılır. ') + chalk.magenta('[ > twitbot new  ]'),
        '     help [ H ] : ' + chalk.cyan('Yardım komutlarını göstermek için kullanılır. ') + chalk.magenta('[ > twitbot help  ]'),
        '    start [ S ] : ' + chalk.cyan('Bot işlemleri başlatmak için kullanılır. ') + chalk.magenta('[ > twitbot start  ]'),
        '    flush [ F ] : ' + chalk.cyan('Hesap verilerini sıfırlamak için kullanılır. ') + chalk.magenta('[ > twitbot flush  ]'),
        ' unfollow [ U ] : ' + chalk.cyan('Unfollow işlemleri başlatmak için kullanılır. ') + chalk.magenta('[ > twitbot unfollow  ]'),
        'blacklist [ B ] : ' + chalk.cyan('Yasaklı kullanıcı işlemleri başlatmak için kullanılır. ') + chalk.magenta('[ > twitbot blacklist  ]'),
        ].join('\n'));
};




exports.SelectData = function(list,blacklist,key){

  return   _.pluck(_.filter(list,function(item){
      return !_.contains(blacklist, item.user);
    }), key);
};

exports.FollowCheck = function (list){
   return  _.filter(list, function(item){ return item.following === true; }).length;
}


exports.FavoriteCheck= function (list){
    return  _.filter(list, function(item){ return _.has(item, 'errors'); }).length;
}
