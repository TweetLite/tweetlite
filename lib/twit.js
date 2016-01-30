'use strict';
var Twit = require('twit');
var _ = require('underscore');
var async = require('async');
var method = require('./method.json')
var methods =  _.allKeys(method);
var clor = require('clor');
var libnotify = require('libnotify');
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
 			var data = _.flatten(dump);
 			data =  _.filter(data, function(item){ return !item.retweeted_status; });

	 		resolve(data.map(function(twet){
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

TT.prototype.StreamAction = function(twet,notification,favorite,takip){
	var dump = [];
	var that = this;
	var msg =null;

	if(!twet.retweeted_status){
		Promise.all([that.Blocks({stringify_ids:true}),that.Friends({stringify_ids:true})])
			.then(function(data){

					if(!_.contains(data[0].ids, twet.user.id_str) &&  !_.contains(data[1].ids, twet.user.id_str)){

						if(takip =="Yes"){
							dump.push(that.UserCreate({user_id:twet.user.id_str,follow:true}));
						}

						if(favorite == "Yes"){
							dump.push(that.Favorite({id:twet.id_str}));
						}

						if(takip =="Yes" && favorite == "Yes" ){
							msg =" takip ettik ve twet\'ini favorilere ekledik";
						}else if(takip == "Yes"){
							msg =" takip ettik ";
						}else if(favorite == "Yes"){
							msg =" twet\'ini favorilere ekledik";
						}

					}else{
						dump.push(null);
					}

					dump.push(msg);

					return Promise.all(dump);
			}).then(function(data){
					if(data[0] != null && !_.has(data[0], 'errors')){
							var message =null;
							if(typeof(data[1]) == 'string' ){
								message = data[1];
							}

							if(typeof(data[2]) =='string'){
								message = data[2];
							}

							console.log(`${clor.green(util.Hal(twet.user.screen_name,'i'))}  ${clor.green(message)}`);
								if(notification && notification != "null" && notification != null){
									if(os.platform() =='linux'){
										libnotify.notify(message, { title: util.Hal(twet.user.screen_name,'i') ,image:'twitbot'});
									}else if(os.platform() =='win32'){
										trayballoon({
										    text: util.Hal(twet.user.screen_name,'i') +message,
										    icon: '../lib/assets/48.ico',
										    timeout: 20000
										});
									}
								}


					}

			})
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

TT.prototype.NotFollowingList = function(obj){
	return Promise.all([this.Followers(), this.Friends()]).then(function(data) {
	  return obj == true ? data[0].ids : _.difference(data[1].ids,data[0].ids);
	});
}

TT.prototype.FullUserFavorite = function(list){
	return Promise.all(list.map(function(item){
	 	return this.Favorite({id:item});
	 }.bind(this)));
}


TT.prototype.FullUserMessage = function(list,msg){
	return Promise.all(list.map(function(item){
	 	return this.MessageCreate({user_id:item,text:msg});
	 }.bind(this)));
}



module.exports=exports=TT;
