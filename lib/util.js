var chalk = require('chalk');
var _ = require('underscore'); 

exports.help = function(){
	 console.log([
        '      '+chalk.bgCyan.bold.inverse.white('  TWİTBOT  ')+
        '',
        '      new [ N ] : ' + chalk.cyan('Hesap tanımalası için kullanılır. ') + chalk.magenta('[ > twitbot new  ]'),
        '     help [ H ] : ' + chalk.cyan('Yardım komutlarını göstermek için kullanılır. ') + chalk.magenta('[ > twitbot help  ]'),
        '     live [ L ] : ' + chalk.cyan('Canlı olarak gönderilen twetleri takip eder.  ') + chalk.magenta('[ > twitbot live  ]'),
        '    start [ S ] : ' + chalk.cyan('Bot işlemleri başlatmak için kullanılır. ') + chalk.magenta('[ > twitbot start  ]'),
        '  forever [ F ] : ' + chalk.cyan('Arkplanda botun çalışmasını sağlar. ') + chalk.magenta('[ > twitbot forever  ]'),
        '  version [ V ] : ' + chalk.cyan('Twitbot versiyonunu gösterir. ') + chalk.magenta('[ > twitbot version  ]'),
        ' unfollow [ U ] : ' + chalk.cyan('Unfollow işlemleri başlatmak için kullanılır. ') + chalk.magenta('[ > twitbot unfollow  ]'),
        'blacklist [ B ] : ' + chalk.cyan('Yasaklı kullanıcı işlemleri başlatmak için kullanılır. ') + chalk.magenta('[ > twitbot blacklist  ]'),
        ].join('\n'));
};




exports.SelectData = function(list,blacklist,key){
  return _.pluck(_.filter(list,function(item){
      return !_.contains(blacklist, item.user.id);
    }), key);
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
 
 exports.Hal = function(g,d) {var k="iyelik",a="i",h="e",b="de",l="den",i="ııiiuuüü",f=g[g.length-1],c=~~/[ei][^ıüoö]*[au]l$|alp$/.test(g)*2,j=g.match(/[aıeiouöü]/g).pop(),e=(d==k||d==a)?i["aıeiouöü".indexOf(j)+c]:(/[aıou]/.test(j))?c?"e":"a":"e";if(f==j){e=(d==k)?"n"+e:(d==a||d==h)?"y"+e:e}if(d==b||d==l){e=(/[fstkçşhp]/.test(f)?"t":"d")+e}if(d==k||d==l){e+="n"}return (g+"'"+e).toString();};
