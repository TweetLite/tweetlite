<p align="center">
  <img src="./logo.png" />
</p>

[![Circle Build Status](https://img.shields.io/circleci/project/c0b41/tweetlite.svg?style=flat-square)](https://circleci.com/gh/c0b41/tweetlite) 

# Install
```sh
npm install -g tweetlite@1.0.0
```
# Usage
User add
```sh
tweetlite profile
```

User remove
```sh
tweetlite flush
```

Tweetlite version
```sh
tweetlite version
```

Search keywords, followed users, favorited twet
```sh
tweetlite search
```

Tweetlite automate message
```sh
tweetlite message
```

Unfavorite all yours favorites
```sh
tweetlite unfavorite
```

Unfollowed all nonfollowers users
```sh
tweetlite unfollow
```

Follow live tweting keywords and follow,favorites
```sh
tweetlite watch
```

| params        | value         |
| ------------- |:-------------:|
| noPrompt     | true |
| account     | johndoe      |
| follow | yes      |
| favorite | yes      |
| lang | en,tr,vs     |

### Watch Blacklist and middleware

```js
 exports.use = () => { // must be exports use
	 return async function(twet, args){ // twet and extra cli arguments
     try {

       this.use({
         retweet : {
       		path: 'statuses/retweet',
       		method: 'post'
       	}
       })

       const result = await this.retweet({id:twet.id})

       if (result){
         return true
       } else {
         return new Error('idk wtf happens')
       }

     } catch (err) {
       return err
     }
	 }
 }

exports.blacklist = (args) => { // must be exports blacklist
  return function (twet) {
  		return twet.text.includes('#yolo') && twet.user.id !== args.blockid;
  }
}
```
Run your middleware
```sh
tweetlite watch src=~/drop/twitter-retwet/index.js --account=johndoe --blockid=1243434
```


Your tweetlite middleware
```sh
tweetlite use
```
| params        | value         |
| ------------- |:-------------:|
| account     | johndoe      |
| src | ~/tweetlite-bumps      |

### Write Yours middlewares

```js
 exports.use = () => { // must be exports use
	 return function(args){ // extra cli arguments

     console.log(args); // { yolo:true }

     this.search({q:'#yolo'}).then( data => { // tweetlite avaible this
       console.log(data)
     })

     setInterval(function () {

      console.log('Ping Pong!');

		 }, 2000);

	 }
 }
```
Run your middleware
```sh
tweetlite use src=~/drop/twitter-bumps/index.js --account=johndoe --yolo=true
```

## Tweetlite middlewares
[tweetlite-automate](https://github.com/TweetLite/tweetlite-automate)
[tweetlite-moco](https://github.com/TweetLite/tweetlite-moco)
[tweetlite-nonfollowers]()

## Tweetlite Debug
- tweetlite:middleware
- tweetlite:action
- tweetlite:core
- tweetlite:core:util
- tweetlite:cli

```sh
env DEBUG="tweetlite:cli" tweetlite search
```
