var util = require('./dist/index');
var twitbot = require('../twitbot-core/dist');
var fakeTwet =  require('./test/fake.json');
const cleanStack = require('clean-stack');


//const TT = new twitbot({
//})
//const action = [];

//action.push(util.notActionHimself('xxx'))
//action.push(util.notActionBlocks(['xx', 'xx', 'xx']))
//action.push(util.okActionLanguage('tr'))
//
//
//
//
//util.control(fakeTwet,action).then(result => {
//  console.log(result);
//}).catch(err => {
//  console.log(cleanStack(err.stack));
//})

//function xxx(){
//  return function yolo(twet){
//
//    return new Promise(function (resolve, reject) {
//      resolve(true)
//    });
//
//
//  }
//}
//
//action.push(util.actionFavorite());
//action.push(util.actionUserFollow());
//
//
//util.action(fakeTwet, {}, TT, action)
