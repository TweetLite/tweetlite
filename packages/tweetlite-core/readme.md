## Install

```
npm install --save tweetlite-core@0.1.0
```

## Usage

```js

import TweetLite from 'tweetlite-core';

const TT = new TweetLite({
	consumer_key: "xx",
	consumer_secret: "xxx",
	access_token: "xxx",
	access_token_secret: "xxx",
})

```

| params        | value         |
| ------------- |:-------------:|
| consumer_key     | xx |
| consumer_secret     | xx      |
| access_token | xx      |
| access_token_secret | xx      |
| timeout | xx     |

### Tweetlitecore Methods
[All Methods](./src/method.js)

[Extra Methods](./src/index.js?#LF-78-208)

## Tweetlite use

```js
TT.use(() => {
	return fuckTwet(params){
			// twitbot avaible area
			return this.followers()
	}
}) // now TT.extra.fuckTwet avaible

TT.extra.fuckTwet({yolo:true})
// or

TT.use({
	hello:{
		path: 'search/tweets',
		method: 'get'
	}
})

```
