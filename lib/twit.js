var Twit = require('twit');
var _ = require('underscore');
var async = require('async');
var Promise = require('native-or-bluebird');
var method = require('./method.json')
var methods =  _.allKeys(method);

function TT(obj){
	this.T= new Twit(obj);
}


methods.forEach(function(key) {
   TT.prototype[key] = function query(obj){
		return new Promise(function (resolve, reject) {
			this.T.get(method[key], obj || {}, function (err, data, response) {
				 if(err) reject(err);
				 else resolve(data);
			});	
		}.bind(this));
	}
});


TT.prototype.FullSearch= function(obj) {
	var query = _.extend({ q: 'Mr Robot',lang:'tr',result_type:'recent',count:100},obj || {});
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
	 				user:twet.user.id
	 			}
	 		}));
	 	})
 	});


};

var T = new TT({
  
});


//Promise.all([T.Followers(), T.Friends()]).then(function(data) {
//  console.log(_.difference(data[1].ids,data[0].ids).length);
//});

//T.FullSearch({count:100}).then(function(data){
//		console.log(data);
//})
 

//T.UserSearch({q:"cobaimelan"}).then(function(data){
//	console.log(data);	
//});