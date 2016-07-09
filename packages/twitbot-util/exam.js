var util = require('./dist/index');
var fakeTwet =  require('./test/fake.json');
const cleanStack = require('clean-stack');

const action = [];

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

function xxx(){
  return function yolo(twet){
    return new Promise(function (resolve, reject) {
      resolve(twet);
    })

  }
}

action.push(util.actionFavorite());
action.push(util.actionFavorite());

util.action(fakeTwet, {}, {}, action)
