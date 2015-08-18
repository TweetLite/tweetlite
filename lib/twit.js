var Twit = require('twit');
var _ = require('underscore');
var async = require('async');
var Promise = require('native-or-bluebird');
var method = require('./method.json')
var methods =  _.allKeys(method);
var chalk = require('chalk');
var growl = require('notify-send');
var trayballoon = require('trayballoon')
var forEachAsync = require('forEachAsync').forEachAsync;
var os = require('os');
var util = require('../lib/util.js');

function TT(obj){
	this.T= new Twit(obj);
}


methods.forEach(function(key) {
   TT.prototype[key] = function query(obj){
		return new Promise(function (resolve, reject) {
			this.T[method[key]["method"]](method[key]["path"], obj || {}, function (err, data, response) {
				if(err && err.statusCode != 403){
				   reject(err);
				}else{
					resolve(data)
				}
			});	
		}.bind(this));
	}
});


TT.prototype.FullSearch = function(obj) {
	var query = _.extend({lang:'tr',result_type:'recent',count:100},obj || {});
	var limit =2;
	var count =0;
	var dump=[]; 
 	
 	var LoadTwit = (function (obj,cb){

		return this.Search(obj)
				.then(function(data){

					dump.push(data.statuses);	

					if(count != limit && count < limit  ){
					    query.max_id =data.search_metadata.max_id;
		                 LoadTwit(query,cb);
		                 count++;
		            }else{ 
		            	return cb(dump);
		            }

                
            });

    }.bind(this));
	
 	return new Promise(function (resolve, reject) {
 		return LoadTwit(query,function(dump){ 
	 		resolve(_.flatten(dump).map(function(twet){
	 			return {
	 				text:twet.text,
	 				id:twet.id,
	 				id_str:twet.id_str,
	 				user:twet.user.id,
	 				user_str:twet.user.id_str
	 			}
	 		}));
	 	})
 	});


};


TT.prototype.Stream = function(opt){
	return this.T.stream('statuses/filter',opt);
}

TT.prototype.StreamAction = function(twet,blacklist,lang,notification,favorite){
	var dump = [this.UserCreate({user_id:twet.user.id_str,follow:true})];
	var msg = " takip ettik";
	if(favorite == "Evet"){
		dump.push(this.Favorite({id:twet.id_str}))
		msg +=" ve twet\'ini favorilere ekledik";
	}

	if(!_.contains(blacklist, twet.user.id_str) && twet.lang == lang){
		Promise.all(dump)
				.then(function(data){
						console.log(chalk.green('   '+util.Hal(twet.user.screen_name,'i') +msg)); 
						if(notification && notification != null){
							if(os.platform() =='linux'){
								growl.icon('twitbot').normal.notify(util.Hal(twet.user.screen_name,'i'), msg);
							}else if(os.platform() =='win32'){
								trayballoon({
								    text: util.Hal(twet.user.screen_name,'i') +msg,
								    icon: '../lib/assets/48.ico',
								    timeout: 20000
								});
							}
						}

				});
		
	}

}

TT.prototype.FullUserDestroy = function(list){
	
 	return forEachAsync(list, function (next, item, index, array) {
		this.UserDestroy({user_id:item}).then(function(data){
			if(data && data != "undefined"){
				next();
			}
		});	     
	}.bind(this));
}


TT.prototype.FullUserFollow = function(list){
	return Promise.all(list.map(function(item){
	 	return this.UserCreate({user_id:item,follow:true});
	 }.bind(this)));
}

TT.prototype.NotFollowingList = function(){
	return Promise.all([this.Followers(), this.Friends()]).then(function(data) {
	  return _.difference(data[1].ids,data[0].ids);
	});
}

TT.prototype.FullUserFavorite = function(list){
	return Promise.all(list.map(function(item){
	 	return this.Favorite({id:item});
	 }.bind(this)));
}





module.exports=exports=TT;
