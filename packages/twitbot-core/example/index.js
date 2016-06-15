const TwitBot = require('../lib/index.js');
const TT = new TwitBot({
	consumer_key : "xxxx",
	consumer_secret : "xxxx",
	access_token : "xxxx",
	access_token_secret : "xxx"
});

TT.use({
	friendsbla : {
		path: 'friends/ids',
		method: 'get'
	}
})

console.log(TT);
