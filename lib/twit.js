var Twit = require('twit');
var _ = require('underscore');
var async = require('async');
var Promise = require('native-or-bluebird');
var method = require('./method.json')
var methods =  _.allKeys(method);
var forEachAsync = require('forEachAsync').forEachAsync;

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

TT.prototype.FullUserSearch = function(username){
	return this.UserSearch({q:username}).then(function(data){
			return _.find(data, function(item) {
                return item.name = username; 
            }); 
	});
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
	return Promise.all([T.Followers(), T.Friends()]).then(function(data) {
	  return _.difference(data[1].ids,data[0].ids);
	});
}

TT.prototype.FullUserFavorite = function(list){
	return Promise.all(list.map(function(item){
	 	return this.Favorite({id:item});
	 }.bind(this)));
}



//T.FullSearch({q:"Mr Robot",count:10}).then(function(data){
//		console.log(data);
//})

//T.UserSearch({q:"cobaimelan"}).then(function(data){
//	console.log(data);	
//});

//T.FullUserSearch("cobaimelan").then(function(data){
//	console.log(data);	
//});

//T.Favorite({id:'632160171763081217',include_entities:true}).then(function(data){
//	console.log(data);
//}).catch(function(err){
//	console.log(err);
//});

//T.NotFollowingList().then(function(data){
//	return T.FullUserDestroy(data);
//}).then(function(){
//   console.log("Bang");
//});

//T.UserDestroy({user_id:2811823147}).then(function(data){
//		console.log(data);
//});

//T.FullUserFollow([2811823147,2811823147,2811823147]).then(function(data){
//		console.log(data);
//});


//T.FullUserFavorite(['632209226618785792','632208317348192256']).then(function(data){
//		console.log(data);
//});




module.exports=exports=TT;
