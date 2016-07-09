var util = require('./dist/index');
var twitbot = require('../twitbot-core/dist');
var fakeTwet =  require('./test/fake.json');
const cleanStack = require('clean-stack');


//const TT = new twitbot({
//})
//const action = [];
//const blacklist = [];
//
//blacklist.push(util.notActionHimself('mugeanlifan'))
//action.push(util.notActionBlocks(['xx', 'xx', 'xx']))
//blacklist.push(util.okActionLanguage('tr'))
//
//
//
//
//

//function xxx(){
//  return function yolo(twet){
//
//    return new Promise(function (resolve, reject) {
//      reject(new Error('yolo'))
//    });
//
//
//  }
//}
//
//action.push(util.actionFavorite());
//action.push(util.actionUserFollow());
//action.push(xxx())
//
//

//const stream = TT.tweetStream({track: ['#nw']})
//
//stream.on('tweet', twet => {
//	util.control(twet, blacklist).then(result => {
//		if (result) {
//		util.action(fakeTwet, {}, TT, action)
//		} else {
//			console.log(result);
//		}
//	}).catch(err => {
//		// Houston we have a problem
//		console.log(cleanStack(err.stack));
//	})
//})
