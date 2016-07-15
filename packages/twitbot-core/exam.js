var twitbot = require('./dist/index');


var TT = new twitbot({
	consumer_key: "hpd0jrNzNUlzEj8UffcPN6vUM",
	consumer_secret: "ebx9FcsOvoyuKmLjEQLpAiKEfu8JcbsOWqOclUmokXmHJdtMPZ",
	access_token: "3842022509-4mDSSu1uzvcQEfLNefpkDAe5OBq67H9ND9e5bRF",
	access_token_secret: "ah2Se5DgsMapxbMCREVDTto8yUchxR0SylIEkbLb4yOd8",
})


TT.extra.fullFollowers().then(result => {
	return TT.extra.fullUserMessage(result, `İyiyim sen nasılsın?`);
}).then(data => {
	console.log(data.length)
}).catch(err => console.log(err) )
